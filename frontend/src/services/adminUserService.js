import { getJson, apiRequest } from './api.js'

export function getAdminOverview(options = {}) {
  return getJson('/api/admin/overview', {}, options)
}

export function listAdminUsers(query = {}, options = {}) {
  return getJson('/api/admin/users', query, options)
}

export function updateAdminUser(id, changes) {
  return apiRequest(`/api/admin/users/${id}`, { method: 'PATCH', body: changes })
}
