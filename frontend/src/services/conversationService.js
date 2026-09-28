const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function handleJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`)
  return data
}

async function getJson(path) {
  const response = await fetch(`${apiUrl}${path}`, { credentials: 'include' })
  return handleJson(response)
}

async function postJson(path, body) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleJson(response)
}

export function listConversations() {
  return getJson('/api/conversations')
}

// listingType: 'room' | 'roommate' | 'pass_room' | 'item' | 'vehicle'
export function startConversation(listingType, listingId) {
  return postJson('/api/conversations', { listingType, listingId })
}

export function getMessages(conversationId) {
  return getJson(`/api/conversations/${conversationId}/messages`)
}

export function sendMessageHttp(conversationId, body) {
  return postJson(`/api/conversations/${conversationId}/messages`, { body })
}
