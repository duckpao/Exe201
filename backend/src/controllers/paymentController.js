const paymentModel = require('../models/paymentModel')
const payosService = require('../services/payosService')
const { parsePagination, buildPagination } = require('../utils/pagination')

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

async function listSuccessfulPayments(request, response) {
  const { page, limit, offset } = parsePagination(request.query, 20)
  const listingType = request.query.listing_type || null
  const result = await paymentModel.listSuccessfulForAdmin({ listingType, page, limit, offset })
  response.json({
    data: result.rows.map((row) => ({
      id: row.id,
      txnRef: row.txn_ref,
      amount: Number(row.amount),
      provider: row.provider,
      providerOrderCode: row.provider_order_code,
      providerTransaction: row.provider_transaction,
      status: row.status,
      paidAt: row.paid_at,
      consumedAt: row.consumed_at,
      listingType: row.listing_type || 'posting_credit',
      listingId: row.listing_id,
      user: { id: row.user_id, name: row.user_name, email: row.user_email },
    })),
    summary: {
      transactionCount: Number(result.summary.transaction_count),
      totalAmount: Number(result.summary.total_amount),
    },
    breakdown: result.breakdown.map((row) => ({
      listingType: row.listing_type,
      transactionCount: Number(row.transaction_count),
      totalAmount: Number(row.total_amount),
    })),
    pagination: buildPagination({ page, limit, total: Number(result.summary.transaction_count) }),
  })
}

module.exports = { getPostingStatus, createPayosPayment, payosWebhook, getPayosStatus, confirmPayosWebhook, listSuccessfulPayments }