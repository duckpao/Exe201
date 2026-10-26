import { getJson, postJson } from './api.js'

export function listAdminTransactions(query = {}, options = {}) {
  return getJson('/api/payments/admin/transactions', query, options)
}

export function getPostingStatus(options = {}) {
  return getJson('/api/payments/posting-status', {}, options)
}

export function createPayosPayment() {
  return postJson('/api/payments/payos/create', {})
}

export function getPayosPaymentStatus(orderCode, options = {}) {
  return getJson(`/api/payments/payos/status/${orderCode}`, {}, options)
}