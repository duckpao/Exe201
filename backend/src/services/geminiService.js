const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const TIMEOUT_MS = 20000

function redactSensitiveText(value) {
  return String(value || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email đã ẩn]')
    .replace(/(?:\+?84|0)(?:\d[ .-]?){8,10}\d/g, '[số điện thoại đã ẩn]')
}

function getConfig() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw Object.assign(new Error('Máy chủ chưa cấu hình GEMINI_API_KEY'), { http_code: 503 })
  return { apiKey, model: process.env.GEMINI_MODEL || 'gemini-3.8-flash' }
}

function getStatus() {
  return {
    available: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  }
}

function textFromResponse(data) {
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || ''
}

async function answerListingQuestion({ question, listingType, listing, similarRooms, history }) {
  const { apiKey, model } = getConfig()
  const systemInstruction = `Bạn là trợ lý AI của RentMate Hola, hỗ trợ khách tìm hiểu bài đăng nhà trọ.
Chỉ sử dụng dữ liệu được cung cấp. Không bịa giá, địa chỉ, tiện ích, tình trạng hoặc cam kết thay chủ bài.
Nếu thông tin không có, nói rõ "Thông tin này chưa được cập nhật" và khuyên khách hỏi chủ bài.
Khi đề xuất phòng tương tự, chỉ dùng đúng danh sách PHÒNG TƯƠNG TỰ và giữ nguyên ID, giá, URL.
Không tiết lộ số điện thoại, email hay dữ liệu cá nhân trong lịch sử chat.
Trả lời bằng tiếng Việt, thân thiện, súc tích, dùng gạch đầu dòng khi hữu ích. Tối đa 450 từ.`

  const context = JSON.stringify({
    listingType,
    currentListing: listing,
    similarRooms,
  }, null, 2)
  const chatHistory = history.map((message) => ({
    source: message.sender_type === 'ai'
      ? 'Trợ lý AI'
      : message.message_kind === 'ai_question' ? 'Khách hỏi AI' : 'Người tham gia chat',
    text: redactSensitiveText(message.body).slice(0, 1200),
  }))
  const contents = [{
    role: 'user',
    parts: [{
      text: `DỮ LIỆU HỆ THỐNG:\n${context}\n\nLỊCH SỬ CHAT THAM KHẢO:\n${JSON.stringify(chatHistory, null, 2)}\n\nCÂU HỎI KHÁCH HÀNG:\n${redactSensitiveText(question)}`,
    }],
  }]

  const response = await fetch(`${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: { temperature: 0.25, maxOutputTokens: 800 },
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = data?.error?.message || `Gemini trả về HTTP ${response.status}`
    throw Object.assign(new Error(detail), { http_code: response.status === 429 ? 429 : 502 })
  }
  const answer = textFromResponse(data)
  if (!answer) throw Object.assign(new Error('Gemini không trả về nội dung phù hợp'), { http_code: 502 })
  return answer
}

module.exports = { answerListingQuestion, getStatus }