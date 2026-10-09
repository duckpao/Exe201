const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')
const listingModel = require('../models/listingModel')
const { getListingType, LISTING_TYPE_KEYS } = require('../models/listingRegistry')
const messagingService = require('../services/messagingService')
const { getIO } = require('../realtime/socket')
const aiChatModel = require('../models/aiChatModel')
const geminiService = require('../services/geminiService')

const aiRequestTimes = new Map()
const AI_COOLDOWN_MS = 5000

function listingUrl(listingType, listingId) {
  const config = getListingType(listingType)
  if (!config) return null
  return `${config.path}/${listingId}`
}

function toConversationCard(row, userId) {
  const isOwner = row.owner_id === userId
  return {
    id: row.id,
    listingType: row.listing_type,
    listingId: row.listing_id,
    listingTitle: row.listing_title || 'Bài đăng đã bị gỡ',
    listingImage: row.listing_image,
    listingUrl: row.listing_title ? listingUrl(row.listing_type, row.listing_id) : null,
    counterpart: isOwner
      ? { id: row.inquirer_id, name: row.inquirer_name, avatar: row.inquirer_avatar }
      : { id: row.owner_id, name: row.owner_name, avatar: row.owner_avatar },
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
    unreadCount: row.unread_count,
  }
}

async function startConversation(request, response) {
  const { listingType, listingId, roomListingId } = request.body || {}

  // roomListingId là dạng cũ (chỉ dành cho phòng trọ), vẫn nhận để không phá client cũ.
  const type = listingType || (roomListingId ? 'room' : null)
  const id = listingId || roomListingId

  if (!type || !id) {
    return response.status(400).json({ message: 'Thiếu loại bài đăng hoặc mã bài đăng' })
  }
  const config = getListingType(type)
  if (!config) {
    return response.status(400).json({ message: `Loại bài đăng không hợp lệ (${LISTING_TYPE_KEYS.join(', ')})` })
  }

  const listing = await listingModel.findOwner(type, id)
  if (!listing) {
    return response.status(404).json({ message: `Không tìm thấy ${config.label}` })
  }

  if (listing.owner_id === request.user.id) {
    return response.status(400).json({ message: 'Bạn không thể tự nhắn tin cho chính mình' })
  }

  const conversation = await conversationModel.findOrCreate({
    listingType: type,
    listingId: listing.id,
    ownerId: listing.owner_id,
    inquirerId: request.user.id,
  })

  response.status(201).json({
    id: conversation.id,
    listingType: conversation.listing_type,
    listingId: conversation.listing_id,
    listingTitle: listing.title,
    listingUrl: listingUrl(type, listing.id),
    counterpart: { id: listing.owner_id, name: listing.owner_name, avatar: listing.owner_avatar },
  })
}

async function listConversations(request, response) {
  const rows = await conversationModel.listForUser(request.user.id)
  response.json({ data: rows.map((row) => toConversationCard(row, request.user.id)) })
}

function getAiStatus(request, response) {
  response.json(geminiService.getStatus())
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

async function postAiMessage(request, response) {
  const conversationId = request.params.id
  const question = String(request.body?.body || '').trim()
  if (!question) return response.status(400).json({ message: 'Vui lòng nhập câu hỏi cho trợ lý AI' })
  if (question.length > 1500) return response.status(400).json({ message: 'Câu hỏi AI không được vượt quá 1.500 ký tự' })
  const rateLimitKey = `${request.user.id}:${conversationId}`
  const lastRequestAt = aiRequestTimes.get(rateLimitKey) || 0
  if (Date.now() - lastRequestAt < AI_COOLDOWN_MS) {
    return response.status(429).json({ message: 'Bạn đang hỏi AI quá nhanh. Vui lòng chờ vài giây rồi thử lại.' })
  }
  const conversation = await conversationModel.findById(conversationId)
  if (!conversation) return response.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện' })
  const allowed = conversation.owner_id === request.user.id || conversation.inquirer_id === request.user.id
  if (!allowed) return response.status(403).json({ message: 'Bạn không thuộc cuộc trò chuyện này' })

  const listing = await aiChatModel.getListingContext(conversation.listing_type, conversation.listing_id)
  if (!listing) return response.status(404).json({ message: 'Bài đăng liên quan không còn tồn tại' })

  const [history, similarRooms] = await Promise.all([
    messageModel.listRecentByConversation(conversationId, { limit: 12 }),
    aiChatModel.findSimilarRooms(conversation.listing_type, listing),
  ])
  aiRequestTimes.set(rateLimitKey, Date.now())
  let answer
  try {
    answer = await geminiService.answerListingQuestion({
      question,
      listingType: conversation.listing_type,
      listing,
      similarRooms,
      history,
    })
  } catch (error) {
    aiRequestTimes.delete(rateLimitKey)
    throw error
  }
  const { question: questionMessage, answer: answerMessage } = await messageModel.createAiExchange({
    conversationId,
    senderId: request.user.id,
    question,
    answer,
  })
  const room = getIO()?.to(`conv:${conversationId}`)
  room?.emit('message:new', questionMessage)
  room?.emit('message:new', answerMessage)
  response.status(201).json({ question: questionMessage, answer: answerMessage })
}

module.exports = { startConversation, listConversations, getAiStatus, getMessages, postMessage, postAiMessage }
