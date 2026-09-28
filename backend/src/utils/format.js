function parseVndAmount(text) {
  if (text === null || text === undefined) return null
  if (typeof text === 'number') return text
  const digits = String(text).replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

function formatVnd(amount, suffix = '') {
  if (amount === null || amount === undefined) return null
  const formatted = Number(amount).toLocaleString('vi-VN')
  return `${formatted}đ${suffix}`
}

function parseAreaM2(text) {
  if (text === null || text === undefined) return null
  if (typeof text === 'number') return text
  const match = String(text).replace(',', '.').match(/[\d.]+/)
  return match ? Number(match[0]) : null
}

function formatArea(value) {
  if (value === null || value === undefined) return null
  return `${Number(value)}m²`
}

function formatJoinedDuration(createdAt) {
  if (!createdAt) return null
  const createdDate = new Date(createdAt)
  const months = Math.max(
    0,
    (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
  const roundedMonths = Math.floor(months)
  if (roundedMonths < 1) return 'Mới tham gia'
  return `Đã tham gia ${roundedMonths} tháng trước`
}

function formatDateVn(value) {
  if (!value) return null
  const datePart = String(value).slice(0, 10)
  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return null
  return `${day}/${month}/${year}`
}

// Ghép địa chỉ từ các phần có thể NULL. Từ khi Việt Nam bỏ cấp huyện (7/2025),
// addresses.district là NULL với bài đăng mới nên không được nối thẳng vào chuỗi.
// Nhận cả row từ DB (street_address) và object camelCase.
function formatAddress(source = {}) {
  const { street_address: streetSnake, streetAddress, ward, district, province } = source
  return [streetAddress || streetSnake, ward, district, province].filter(Boolean).join(', ') || null
}

module.exports = {
  parseVndAmount,
  formatVnd,
  parseAreaM2,
  formatArea,
  formatJoinedDuration,
  formatDateVn,
  formatAddress,
}
