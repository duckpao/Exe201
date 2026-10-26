const paymentModel = require('../models/paymentModel')
const subscriptionModel = require('../models/subscriptionModel')
const payosService = require('./payosService')
const { notifyUser } = require('./notifyService')
const { getPlan, TIER_LABELS, CYCLE_LABELS } = require('../config/plans')

// Gọi lại nhiều lần vẫn an toàn: activateFromPayment trả null khi payment_id đã có gói.
async function activateSubscription(payment) {
  const periodId = await subscriptionModel.activateFromPayment(payment)
  if (!periodId) return
  const plan = getPlan(payment.plan_code)
  await notifyUser({
    userId: payment.user_id,
    type: 'subscription',
    title: `Gói ${TIER_LABELS[plan.tier]} theo ${CYCLE_LABELS[plan.cycle]} đã được kích hoạt`,
    body: 'Bài đăng của bạn đã có badge thành viên. Xem thời hạn tại mục Gói đăng ký.',
    emailSubject: 'Gói đăng ký RentMate Hola đã được kích hoạt',
  })
}

// Dùng chung cho webhook và đối soát: ghi kết quả đã xác minh, rồi kích hoạt gói nếu là gói đăng ký.
async function settle({ orderCode, status, providerTransaction, paymentLinkId }) {
  const updated = await paymentModel.markPayosResult({ orderCode, status, providerTransaction, paymentLinkId })
  if (updated?.purpose === 'subscription' && updated.status === 'paid') {
    await activateSubscription(updated)
  }
  return updated
}

// null nghĩa là payOS chưa cho kết luận. Chỉ coi là đã trả khi đúng mã đơn và đủ số tiền.
function readPayosVerdict(payment, info) {
  if (!info || Number(info.orderCode) !== Number(payment.provider_order_code)) return null
  if (info.status === 'PAID') {
    return Number(info.amountPaid) >= Number(payment.amount) ? 'paid' : null
  }
  if (info.status === 'CANCELLED' || info.status === 'EXPIRED') return 'cancelled'
  return null
}

// Webhook không phải lúc nào cũng đến được máy chủ, nên hỏi thẳng payOS bằng mã đơn hàng của giao dịch.
// Lỗi mạng hay lỗi payOS chỉ để giao dịch ở trạng thái cũ, lần hỏi sau thử lại.
async function reconcile(payment) {
  if (payment.provider !== 'payos' || !payment.provider_order_code) return payment

  if (payment.status === 'paid') {
    if (payment.purpose === 'subscription') await activateSubscription(payment)
    return payment
  }
  if (payment.status !== 'pending') return payment

  let info
  try {
    info = await payosService.getPaymentLink(payment.provider_order_code)
  } catch (error) {
    console.error('Đối soát payOS thất bại:', payment.provider_order_code, error.message)
    return payment
  }

  const verdict = readPayosVerdict(payment, info)
  if (!verdict) {
    if (info?.status === 'PAID') {
      console.error('payOS báo đã trả nhưng số tiền hoặc mã đơn không khớp:', payment.provider_order_code, info.amountPaid)
    }
    return payment
  }

  return settle({
    orderCode: payment.provider_order_code,
    status: verdict,
    providerTransaction: info.transactions?.[0]?.reference,
    paymentLinkId: info.id,
  })
}

module.exports = { settle, reconcile }
