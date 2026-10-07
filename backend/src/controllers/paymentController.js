const paymentModel = require('../models/paymentModel')
const vnpayService = require('../services/vnpayService')

const LISTING_FEE = Number(process.env.LISTING_FEE_VND) || 20000

async function getPostingStatus(request, response) {
  const access = await paymentModel.getPostingAccess(request.user.id)
  if (!access) return response.status(404).json({ message: 'Không tìm thấy tài khoản' })
  response.json({
    inFreeTrial: Number(access.user.in_free_trial) === 1,
    freeUntil: access.user.free_until,
    hasCredit: Boolean(access.credit),
    fee: LISTING_FEE,
  })
}

async function createVnpayPayment(request, response) {
  const access = await paymentModel.getPostingAccess(request.user.id)
  if (Number(access?.user.in_free_trial) === 1) {
    return response.status(400).json({ message: 'Tài khoản của bạn vẫn đang trong 2 tháng miễn phí' })
  }
  if (access?.credit) {
    return response.status(400).json({ message: 'Bạn đang có một lượt đăng bài chưa sử dụng' })
  }
  const txnRef = `POST${request.user.id}${Date.now()}`
  await paymentModel.createPending({ userId: request.user.id, txnRef, amount: LISTING_FEE })
  const paymentUrl = vnpayService.createPaymentUrl({
    txnRef,
    amount: LISTING_FEE,
    ipAddress: request.ip?.replace('::ffff:', ''),
    orderInfo: `Thanh toan phi dang bai ${txnRef}`,
  })
  response.status(201).json({ paymentUrl, txnRef, amount: LISTING_FEE })
}

async function processResult(query) {
  if (!vnpayService.verifyCallback(query)) return { valid: false, paid: false }
  const payment = await paymentModel.findByTxnRef(query.vnp_TxnRef)
  if (!payment || Number(payment.amount) * 100 !== Number(query.vnp_Amount)) return { valid: false, paid: false }
  const paid = query.vnp_ResponseCode === '00' && query.vnp_TransactionStatus === '00'
  const updated = await paymentModel.markResult({
    txnRef: query.vnp_TxnRef,
    paid,
    responseCode: query.vnp_ResponseCode,
    providerTransaction: query.vnp_TransactionNo,
  })
  return { valid: true, paid: updated.status === 'paid', payment: updated }
}

async function vnpayIpn(request, response) {
  const result = await processResult(request.query)
  if (!result.valid) return response.json({ RspCode: '97', Message: 'Invalid signature or order' })
  response.json({ RspCode: '00', Message: 'Confirm Success' })
}

async function vnpayReturn(request, response) {
  const result = await processResult(request.query)
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173'
  const status = result.valid && result.paid ? 'success' : result.valid ? 'failed' : 'invalid'
  response.redirect(`${frontend}/thanh-toan/ket-qua?status=${status}&txnRef=${encodeURIComponent(request.query.vnp_TxnRef || '')}`)
}

module.exports = { getPostingStatus, createVnpayPayment, vnpayIpn, vnpayReturn }