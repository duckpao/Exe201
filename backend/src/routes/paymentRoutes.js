const express = require('express')
const paymentController = require('../controllers/paymentController')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')

const router = express.Router()
router.get('/posting-status', requireAuth, paymentController.getPostingStatus)
router.get('/admin/transactions', requireAuth, requireRole('admin'), paymentController.listSuccessfulPayments)
router.post('/payos/create', requireAuth, paymentController.createPayosPayment)
router.get('/payos/status/:orderCode', requireAuth, paymentController.getPayosStatus)
router.post('/payos/webhook', paymentController.payosWebhook)
router.post('/payos/confirm-webhook', requireAuth, paymentController.confirmPayosWebhook)
module.exports = router