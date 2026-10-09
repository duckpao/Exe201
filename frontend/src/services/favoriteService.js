import { deleteJson, getJson, postJson } from './api.js'

export function listFavorites(options = {}) {
  return getJson('/api/favorites', {}, options)
}

export function checkFavorite(entityType, entityId, options = {}) {
  return getJson(`/api/favorites/check/${entityType}/${entityId}`, {}, options)
}

export function addFavorite(entityType, entityId) {
  return postJson('/api/favorites', { entityType, entityId })
}

export function removeFavorite(entityType, entityId) {
  return deleteJson(`/api/favorites/${entityType}/${entityId}`)
}
