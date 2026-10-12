import { getJson, postJson } from './api.js'

export function listAdminListings(query = {}, options = {}) {
  return getJson('/api/admin/listings', query, options)
}

export function hideAdminListing(type, id, reason) {
  return postJson(`/api/admin/listings/${type}/${id}/hide`, { reason })
}

export function unhideAdminListing(type, id) {
  return postJson(`/api/admin/listings/${type}/${id}/unhide`, {})
}
