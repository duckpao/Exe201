import { getJson, postJson } from './api.js'

export function listPlans(options = {}) {
  return getJson('/api/subscriptions/plans', {}, options)
}

export function getMySubscription(options = {}) {
  return getJson('/api/subscriptions/me', {}, options)
}

export function checkoutSubscription(planCode) {
  return postJson('/api/subscriptions/checkout', { planCode })
}

export function getSubscriptionStats(options = {}) {
  return getJson('/api/subscriptions/me/stats', {}, options)
}
