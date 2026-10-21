const notificationModel = require('../models/notificationModel')
const userModel = require('../models/userModel')
const { sendMail } = require('../config/mailer')
const { escapeHtml } = require('../utils/html')

// Thông báo trên web luôn được ghi; email là kênh phụ và lỗi SMTP không làm hỏng thao tác chính.
async function notifyUser({ userId, type, title, body = null, emailSubject = null }) {
  await notificationModel.create({ userId, type, title, body })
  if (!emailSubject) return
  try {
    const user = await userModel.findById(userId)
    if (!user?.email) return
    await sendMail({
      to: user.email,
      subject: emailSubject,
      html: `<p>Xin chào ${escapeHtml(user.full_name)},</p>
             <p><strong>${escapeHtml(title)}</strong></p>
             ${body ? `<p>${escapeHtml(body)}</p>` : ''}`,
    })
  } catch (error) {
    console.error('Gửi email thông báo thất bại:', error.message)
  }
}

module.exports = { notifyUser }
