const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function getJson(path) {
  const response = await fetch(`${apiUrl}${path}`)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export function getHealth() {
  return getJson('/api/health')
}

export function getTasks() {
  return getJson('/api/tasks')
}
