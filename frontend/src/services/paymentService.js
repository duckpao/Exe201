import { getJson, postJson } from './api.js'

export function listAdminTransactions(query = {}, options = {}) {
  return getJson('/api/payments/admin/transactions', query, options)
}

export function getPostingStatus(options = {}) {
  return getJson('/api/payments/posting-status', {}, options)
}

export function createPayosPayment(options = {}) {
  return postJson('/api/payments/payos/create', {}, options)
}

export function getPayosPaymentStatus(orderCode, options = {}) {
  return getJson(`/api/payments/payos/status/${orderCode}`, {}, options)
}