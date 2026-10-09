const express = require('express')
const itemController = require('../controllers/itemController')
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', itemController.listItems)
router.get('/:id', optionalAuth, itemController.getItem)
router.post('/', requireAuth, requirePostingAccess, uploadImages, itemController.createItem)
router.patch('/:id/status', requireAuth, itemController.updateItemStatus)

module.exports = router
