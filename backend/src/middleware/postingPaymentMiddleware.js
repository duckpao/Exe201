const paymentModel = require('../models/paymentModel')

async function requirePostingAccess(request, response, next) {
  const access = await paymentModel.getPostingAccess(request.user.id)
  if (!access) return response.status(404).json({ message: 'Không tìm thấy tài khoản' })
  if (Number(access.user.in_free_trial) === 1) {
    request.postingPayment = { freeTrial: true, freeUntil: access.user.free_until }
    return next()
  }
  if (access.credit) {
    request.postingPayment = { freeTrial: false, paymentId: access.credit.id }
    return next()
  }
  return response.status(402).json({
    message: 'Thời gian miễn phí đã kết thúc. Vui lòng thanh toán phí đăng bài để tiếp tục.',
    code: 'POSTING_PAYMENT_REQUIRED',
    paymentRequired: true,
  })
}

async function consumePostingCredit(request, listingType, listingId) {
  if (!request.postingPayment || request.postingPayment.freeTrial) return
  await paymentModel.consumeCredit({ paymentId: request.postingPayment.paymentId, userId: request.user.id, listingType, listingId })
}

module.exports = { requirePostingAccess, consumePostingCredit }