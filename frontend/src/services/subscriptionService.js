import { getJson, postJson } from './api.js'

export function listPlans(options = {}) {
  return getJson('/api/subscriptions/plans', {}, options)
}

export function getMySubscription(options = {}) {
  return getJson('/api/subscriptions/me', {}, options)
}

export function checkoutSubscription(planCode, returnTo) {
  return postJson('/api/subscriptions/checkout', { planCode, returnTo })
}

export function getSubscriptionStats(options = {}) {
  return getJson('/api/subscriptions/me/stats', {}, options)
}
