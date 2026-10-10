const apiUrl = import.meta.env.VITE_API_URL || 'https://rentmate-qd9h.onrender.com'

async function handleJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`)
  return data
}

export async function autocompleteAddress(text, signal) {
  const params = new URLSearchParams({ text })
  const response = await fetch(`${apiUrl}/api/maps/autocomplete?${params}`, { credentials: 'include', signal })
  const result = await handleJson(response)
  return result.data || []
}

export async function getAddressPlace(refId) {
  const params = new URLSearchParams({ refId })
  const response = await fetch(`${apiUrl}/api/maps/place?${params}`, { credentials: 'include' })
  return handleJson(response)
}