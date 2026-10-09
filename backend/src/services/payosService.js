const crypto = require('crypto')

const PAYOS_API_URL = process.env.PAYOS_API_URL || 'https://api-merchant.payos.vn'
const TIMEOUT_MS = 15000

function getConfig() {
  const clientId = process.env.PAYOS_CLIENT_ID
  const apiKey = process.env.PAYOS_API_KEY
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY
  if (!clientId || !apiKey || !checksumKey) {
    throw Object.assign(new Error('Chưa cấu hình PAYOS_CLIENT_ID, PAYOS_API_KEY hoặc PAYOS_CHECKSUM_KEY'), { http_code: 503 })
  }
  return { clientId, apiKey, checksumKey }
}

function createSignature(data, checksumKey) {
  const signData = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key] == null ? '' : typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]}`)
    .join('&')
  return crypto.createHmac('sha256', checksumKey).update(signData, 'utf8').digest('hex')
}

async function payosRequest(path, options = {}) {
  const { clientId, apiKey } = getConfig()
  const response = await fetch(`${PAYOS_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
      'x-api-key': apiKey,
      ...options.headers,
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.code !== '00') {
    throw Object.assign(new Error(data.desc || `payOS trả về HTTP ${response.status}`), { http_code: response.status >= 500 ? 502 : response.status })
  }
  return data.data
}

async function createPaymentLink({ orderCode, amount, description }) {
  const { checksumKey } = getConfig()
  const returnUrl = process.env.PAYOS_RETURN_URL
  const cancelUrl = process.env.PAYOS_CANCEL_URL
  if (!returnUrl || !cancelUrl) {
    throw Object.assign(new Error('Chưa cấu hình PAYOS_RETURN_URL hoặc PAYOS_CANCEL_URL'), { http_code: 503 })
  }
  const signatureData = { amount, cancelUrl, description, orderCode, returnUrl }
  const payload = {
    orderCode,
    amount,
    description,
    items: [{ name: 'Lượt đăng bài RentMate Hola', quantity: 1, price: amount }],
    cancelUrl,
    returnUrl,
    expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
    signature: createSignature(signatureData, checksumKey),
  }
  return payosRequest('/v2/payment-requests', { method: 'POST', body: JSON.stringify(payload) })
}

async function getPaymentLink(orderCode) {
  return payosRequest(`/v2/payment-requests/${encodeURIComponent(orderCode)}`)
}

function verifyWebhook(payload) {
  const { checksumKey } = getConfig()
  if (!payload?.data || !payload.signature) return false
  const expected = Buffer.from(createSignature(payload.data, checksumKey))
  const received = Buffer.from(String(payload.signature))
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}

async function confirmWebhook(webhookUrl) {
  return payosRequest('/confirm-webhook', { method: 'POST', body: JSON.stringify({ webhookUrl }) })
}

module.exports = { createPaymentLink, getPaymentLink, verifyWebhook, confirmWebhook }