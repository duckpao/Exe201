import { getJson, postJson } from './api.js'

export async function listRooms(query = {}, options = {}) {
  return getJson('/api/rooms', query, options)
}

export async function getRoom(id) {
  return getJson(`/api/rooms/${id}`)
}

export async function createRoom(formData) {
  return postJson('/api/rooms', formData)
}
