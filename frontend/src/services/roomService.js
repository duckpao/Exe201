const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function handleJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`)
  return data
}

export async function listRooms(query = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value)
  })
  const response = await fetch(`${apiUrl}/api/rooms?${params.toString()}`, { credentials: 'include' })
  return handleJson(response)
}

export async function getRoom(id) {
  const response = await fetch(`${apiUrl}/api/rooms/${id}`, { credentials: 'include' })
  return handleJson(response)
}

export async function createRoom(formData) {
  const response = await fetch(`${apiUrl}/api/rooms`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  return handleJson(response)
}
