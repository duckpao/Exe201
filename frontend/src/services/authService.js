import { getJson, postJson } from './api.js'

export function login(email, password) {
  return postJson('/api/auth/login', { email, password })
}

export function loginWithGoogle(idToken) {
  return postJson('/api/auth/google', { idToken })
}

export function register({ fullName, email, phone, password, role }) {
  return postJson('/api/auth/register', { fullName, email, phone, password, role })
}

export function me() {
  return getJson('/api/auth/me')
}

export function logout() {
  return postJson('/api/auth/logout', {})
}

export function forgotPassword(email) {
  return postJson('/api/auth/forgot-password', { email })
}

export function resetPassword(token, newPassword) {
  return postJson('/api/auth/reset-password', { token, newPassword })
}
