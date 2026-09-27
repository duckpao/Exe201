const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')
const roomModel = require('../models/roomModel')
const messagingService = require('../services/messagingService')
const { getIO } = require('../realtime/socket')

function toConversationCard(row, userId) {
  const isLandlord = row.landlord_id === userId
  return {
    id: row.id,
    roomListingId: row.room_listing_id,
    roomTitle: row.room_title,
    roomImage: row.room_image,
    counterpart: isLandlord
      ? { id: row.tenant_id, name: row.tenant_name, avatar: row.tenant_avatar }
      : { id: row.landlord_id, name: row.landlord_name, avatar: row.landlord_avatar },
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
    unreadCount: row.unread_count,
  }
}

async function startConversation(request, response) {
  const { roomListingId } = request.body || {}
  if (!roomListingId) {
    return response.status(400).json({ message: 'Thiếu roomListingId' })
  }

  const room = await roomModel.findById(roomListingId)
  if (!room) {
    return response.status(404).json({ message: 'Không tìm thấy phòng trọ' })
  }

  if (room.landlord_id === request.user.id) {
    return response.status(400).json({ message: 'Bạn không thể tự nhắn tin cho chính mình' })
  }

  const conversation = await conversationModel.findOrCreate({
    roomListingId: room.id,
    landlordId: room.landlord_id,
    tenantId: request.user.id,
  })

  response.status(201).json({
    id: conversation.id,
    roomListingId: conversation.room_listing_id,
    roomTitle: room.title,
    counterpart: { id: room.landlord_user_id, name: room.landlord_name, avatar: room.landlord_avatar },
  })
}

async function listConversations(request, response) {
  const rows = await conversationModel.listForUser(request.user.id)
  response.json({ data: rows.map((row) => toConversationCard(row, request.user.id)) })
}

async function getMessages(request, response) {
  const conversationId = request.params.id
  const allowed = await conversationModel.isParticipant(conversationId, request.user.id)
  if (!allowed) {
    return response.status(403).json({ message: 'Bạn không thuộc cuộc trò chuyện này' })
  }

  const messages = await messageModel.listByConversation(conversationId)
  await messageModel.markRead(conversationId, request.user.id)

  response.json({ data: messages })
}

async function postMessage(request, response) {
  const conversationId = request.params.id
  const { body } = request.body || {}

  const message = await messagingService.sendMessage({
    conversationId,
    senderId: request.user.id,
    body,
    io: getIO(),
  })

  response.status(201).json(message)
}

module.exports = { startConversation, listConversations, getMessages, postMessage }
