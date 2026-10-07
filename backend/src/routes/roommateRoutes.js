const express = require('express')
const roommateController = require('../controllers/roommateController')
const { requireAuth } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', roommateController.listRoommates)
router.get('/:id', roommateController.getRoommate)
router.post('/', requireAuth, requirePostingAccess, uploadImages, roommateController.createRoommate)

module.exports = router
