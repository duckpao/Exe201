const crypto = require('crypto')

const PAYMENT_URL = process.env.VNPAY_PAYMENT_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'

function formatDate(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

function encode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, '+')
}

function signParams(params) {
  const secret = process.env.VNPAY_HASH_SECRET
  if (!secret) throw Object.assign(new Error('Chưa cấu hình VNPAY_HASH_SECRET'), { http_code: 503 })
  const signData = Object.keys(params).sort().map((key) => `${encode(key)}=${encode(params[key])}`).join('&')
  return crypto.createHmac('sha512', secret).update(signData, 'utf8').digest('hex')
}

function createPaymentUrl({ txnRef, amount, ipAddress, orderInfo }) {
  const tmnCode = process.env.VNPAY_TMN_CODE
  const returnUrl = process.env.VNPAY_RETURN_URL
  if (!tmnCode || !returnUrl) {
    throw Object.assign(new Error('Chưa cấu hình VNPAY_TMN_CODE hoặc VNPAY_RETURN_URL'), { http_code: 503 })
  }
  const now = new Date()
  const expire = new Date(now.getTime() + 15 * 60 * 1000)
  const params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: Math.round(Number(amount) * 100),
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddress || '127.0.0.1',
    vnp_CreateDate: formatDate(now),
    vnp_ExpireDate: formatDate(expire),
  }
  params.vnp_SecureHash = signParams(params)
  return `${PAYMENT_URL}?${Object.keys(params).sort().map((key) => `${encode(key)}=${encode(params[key])}`).join('&')}`
}

function verifyCallback(query) {
  const params = { ...query }
  const secureHash = params.vnp_SecureHash
  delete params.vnp_SecureHash
  delete params.vnp_SecureHashType
  if (!secureHash) return false
  const expected = Buffer.from(signParams(params))
  const received = Buffer.from(String(secureHash))
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}

module.exports = { createPaymentUrl, verifyCallback }