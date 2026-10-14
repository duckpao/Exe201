const express = require('express')
const itemController = require('../controllers/itemController')
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware')
const { uploadImages, requireReviewVideo } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', itemController.listItems)
router.get('/:id', optionalAuth, itemController.getItem)
router.post('/', requireAuth, requirePostingAccess, uploadImages, requireReviewVideo, itemController.createItem)

module.exports = router
