import { getJson, putJson, deleteJson } from './api.js'

// type: 'room' | 'roommate' | 'pass_room' | 'item' | 'vehicle'
export function listReviews(type, id, options = {}) {
  return getJson(`/api/reviews/${type}/${id}`, {}, options)
}

export function saveReview(type, id, { rating, comment }) {
  return putJson(`/api/reviews/${type}/${id}`, { rating, comment })
}

export function deleteReview(type, id) {
  return deleteJson(`/api/reviews/${type}/${id}`)
}
