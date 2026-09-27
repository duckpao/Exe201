const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')
const userModel = require('../models/userModel')
const { sendMail } = require('../config/mailer')

async function notifyLandlordByEmail({ conversation, message }) {
  try {
    const landlord = await userModel.findById(conversation.landlord_id)
    const tenant = await userModel.findById(conversation.tenant_id)
    if (!landlord?.email) return

    await sendMail({
      to: landlord.email,
      subject: 'Bạn có tin nhắn mới về phòng trọ đang đăng',
      html: `<p>Xin chào ${landlord.full_name},</p>
             <p>${tenant?.full_name || 'Một người thuê'} vừa gửi cho bạn một tin nhắn mới:</p>
             <p style="padding:12px;background:#f5f5f5;border-radius:8px">${message.body}</p>
             <p>Đăng nhập vào website để trả lời người thuê.</p>`,
    })
  } catch (error) {
    console.error('Gửi email thông báo tin nhắn mới thất bại:', error.message)
  }
}

async function sendMessage({ conversationId, senderId, body, io }) {
  const conversation = await conversationModel.findById(conversationId)
  if (!conversation) {
    throw Object.assign(new Error('Không tìm thấy cuộc trò chuyện'), { http_code: 404 })
  }
  if (conversation.landlord_id !== senderId && conversation.tenant_id !== senderId) {
    throw Object.assign(new Error('Bạn không thuộc cuộc trò chuyện này'), { http_code: 403 })
  }
  if (!body || !body.trim()) {
    throw Object.assign(new Error('Nội dung tin nhắn không được để trống'), { http_code: 400 })
  }

  const message = await messageModel.create({ conversationId, senderId, body: body.trim() })

  if (io) {
    io.to(`conv:${conversationId}`).emit('message:new', message)
  }

  if (senderId !== conversation.landlord_id) {
    notifyLandlordByEmail({ conversation, message })
  }

  return message
}

module.exports = { sendMessage }
