const express = require('express')
const itemController = require('../controllers/itemController')
const { requireAuth } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', itemController.listItems)
router.get('/:id', itemController.getItem)
router.post('/', requireAuth, requirePostingAccess, uploadImages, itemController.createItem)
router.patch('/:id/status', requireAuth, itemController.updateItemStatus)

module.exports = router
