const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')
const userModel = require('../models/userModel')
const listingModel = require('../models/listingModel')
const { getListingType } = require('../models/listingRegistry')
const { sendMail } = require('../config/mailer')

async function notifyOwnerByEmail({ conversation, message }) {
  try {
    const owner = await userModel.findById(conversation.owner_id)
    const inquirer = await userModel.findById(conversation.inquirer_id)
    if (!owner?.email) return

    const config = getListingType(conversation.listing_type)
    const listing = await listingModel.findOwner(conversation.listing_type, conversation.listing_id)
    const listingLabel = config?.label || 'bài đăng'

    await sendMail({
      to: owner.email,
      subject: `Bạn có tin nhắn mới về ${listingLabel} đang đăng`,
      html: `<p>Xin chào ${owner.full_name},</p>
             <p>${inquirer?.full_name || 'Một người dùng'} vừa gửi cho bạn một tin nhắn mới${
               listing?.title ? ` về "${listing.title}"` : ''
             }:</p>
             <p style="padding:12px;background:#f5f5f5;border-radius:8px">${message.body}</p>
             <p>Đăng nhập vào website để trả lời.</p>`,
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
  if (conversation.owner_id !== senderId && conversation.inquirer_id !== senderId) {
    throw Object.assign(new Error('Bạn không thuộc cuộc trò chuyện này'), { http_code: 403 })
  }
  if (!body || !body.trim()) {
    throw Object.assign(new Error('Nội dung tin nhắn không được để trống'), { http_code: 400 })
  }

  const message = await messageModel.create({ conversationId, senderId, body: body.trim() })

  if (io) {
    io.to(`conv:${conversationId}`).emit('message:new', message)
  }

  if (senderId !== conversation.owner_id) {
    notifyOwnerByEmail({ conversation, message })
  }

  return message
}

module.exports = { sendMessage }
