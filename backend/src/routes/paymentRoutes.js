const express = require('express')
const paymentController = require('../controllers/paymentController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()
router.get('/posting-status', requireAuth, paymentController.getPostingStatus)
router.post('/vnpay/create', requireAuth, paymentController.createVnpayPayment)
router.get('/vnpay/ipn', paymentController.vnpayIpn)
router.get('/vnpay/return', paymentController.vnpayReturn)
module.exports = router