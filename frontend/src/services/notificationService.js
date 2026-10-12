import { getJson, putJson } from './api.js'

export function listNotifications(options = {}) {
  return getJson('/api/notifications', {}, options)
}

export function markNotificationRead(id) {
  return putJson(`/api/notifications/${id}/read`, {})
}

export function markAllNotificationsRead() {
  return putJson('/api/notifications/read-all', {})
}
