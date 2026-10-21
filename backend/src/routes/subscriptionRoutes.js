const express = require('express')
const subscriptionController = require('../controllers/subscriptionController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/plans', subscriptionController.listPlans)
router.get('/me', requireAuth, subscriptionController.getMine)
router.get('/me/stats', requireAuth, subscriptionController.getStats)
router.post('/checkout', requireAuth, subscriptionController.checkout)

module.exports = router
