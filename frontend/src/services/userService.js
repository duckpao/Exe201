import { deleteJson, getJson, postJson, putJson } from './api.js'

export function updateProfile(formData) {
  return putJson('/api/users/profile', formData)
}

export function changePassword(oldPassword, newPassword) {
  return putJson('/api/users/password', { oldPassword, newPassword })
}

export function listMyListings(options = {}) {
  return getJson('/api/users/listings', {}, options)
}

export function updateMyListing(type, id, values) {
  return putJson(`/api/users/listings/${type}/${id}`, values)
}

export function deleteMyListing(type, id) {
  return deleteJson(`/api/users/listings/${type}/${id}`)
}
