const paymentModel = require('../models/paymentModel')
const payosService = require('../services/payosService')

const LISTING_FEE = Number(process.env.LISTING_FEE_VND) || 20000

async function getPostingStatus(request, response) {
  const access = await paymentModel.getPostingAccess(request.user.id)
  if (!access) return response.status(404).json({ message: 'Không tìm thấy tài khoản' })
  response.json({
    inFreeTrial: Number(access.user.in_free_trial) === 1,
    freeUntil: access.user.free_until,
    hasCredit: Boolean(access.credit),
    fee: LISTING_FEE,
    provider: 'payos',
  })
}

async function createPayosPayment(request, response) {
  const access = await paymentModel.getPostingAccess(request.user.id)
  if (Number(access?.user.in_free_trial) === 1) {
    return response.status(400).json({ message: 'Tài khoản của bạn vẫn đang trong 2 tháng miễn phí' })
  }
  if (access?.credit) {
    return response.status(400).json({ message: 'Bạn đang có một lượt đăng bài chưa sử dụng' })
  }

  const orderCode = Date.now()
  const txnRef = `PAYOS${orderCode}`
  const description = `POST${request.user.id}`.slice(0, 9)
  const paymentLink = await payosService.createPaymentLink({ orderCode, amount: LISTING_FEE, description })

  await paymentModel.createPending({
    userId: request.user.id,
    txnRef,
    amount: LISTING_FEE,
    provider: 'payos',
    orderCode,
    paymentLinkId: paymentLink.paymentLinkId,
  })

  response.status(201).json({
    orderCode,
    amount: LISTING_FEE,
    checkoutUrl: paymentLink.checkoutUrl,
    qrCode: paymentLink.qrCode,
    accountNumber: paymentLink.accountNumber,
    accountName: paymentLink.accountName,
    bin: paymentLink.bin,
    description: paymentLink.description,
    paymentLinkId: paymentLink.paymentLinkId,
    status: paymentLink.status,
    returnUrl: process.env.PAYOS_RETURN_URL,
  })
}

async function payosWebhook(request, response) {
  if (!payosService.verifyWebhook(request.body)) {
    return response.status(400).json({ success: false, message: 'Invalid signature' })
  }

  const data = request.body.data
  const payment = await paymentModel.findByOrderCode(data.orderCode)
  if (!payment) return response.json({ success: true })
  if (Number(payment.amount) !== Number(data.amount)) {
    return response.status(400).json({ success: false, message: 'Amount mismatch' })
  }

  const paid = request.body.success === true && data.code === '00'
  await paymentModel.markPayosResult({
    orderCode: data.orderCode,
    status: paid ? 'paid' : 'failed',
    providerTransaction: data.reference,
    paymentLinkId: data.paymentLinkId,
  })
  response.json({ success: true })
}

async function getPayosStatus(request, response) {
  const orderCode = Number(request.params.orderCode)
  const payment = await paymentModel.findByOrderCode(orderCode)
  if (!payment || payment.user_id !== request.user.id) {
    return response.status(404).json({ message: 'Không tìm thấy giao dịch' })
  }

  response.json({ orderCode, status: payment.status, paid: payment.status === 'paid' })
}

async function confirmPayosWebhook(request, response) {
  const webhookUrl = process.env.PAYOS_WEBHOOK_URL
  if (!webhookUrl) return response.status(503).json({ message: 'Chưa cấu hình PAYOS_WEBHOOK_URL' })
  const data = await payosService.confirmWebhook(webhookUrl)
  response.json(data)
}

module.exports = { getPostingStatus, createPayosPayment, payosWebhook, getPayosStatus, confirmPayosWebhook }