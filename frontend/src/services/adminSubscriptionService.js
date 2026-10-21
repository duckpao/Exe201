import { getJson, postJson } from './api.js'

export function listAdminSubscriptions(query = {}, options = {}) {
  return getJson('/api/admin/subscriptions', query, options)
}

export function grantSubscription(email, planCode) {
  return postJson('/api/admin/subscriptions/grant', { email, planCode })
}

export function revokeSubscription(id) {
  return postJson(`/api/admin/subscriptions/${id}/revoke`, {})
}
