import { getJson, postJson } from './api.js'

export function listConversations(options = {}) {
  return getJson('/api/conversations', {}, options)
}

export function getAiStatus(options = {}) {
  return getJson('/api/conversations/ai-status', {}, options)
}

// listingType: 'room' | 'roommate' | 'pass_room' | 'item' | 'vehicle'
export function startConversation(listingType, listingId) {
  return postJson('/api/conversations', { listingType, listingId })
}

export function getMessages(conversationId, options = {}) {
  return getJson(`/api/conversations/${conversationId}/messages`, {}, options)
}

export function sendMessageHttp(conversationId, body) {
  return postJson(`/api/conversations/${conversationId}/messages`, { body })
}

export function sendAiMessage(conversationId, body) {
  return postJson(`/api/conversations/${conversationId}/ai-messages`, { body })
}
