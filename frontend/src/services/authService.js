const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function postJson(path, body) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`)
  return data
}

export function login(email, password) {
  return postJson('/api/auth/login', { email, password })
}

export function loginWithGoogle(idToken) {
  return postJson('/api/auth/google', { idToken })
}

export function forgotPassword(email) {
  return postJson('/api/auth/forgot-password', { email })
}

export function resetPassword(token, newPassword) {
  return postJson('/api/auth/reset-password', { token, newPassword })
}
