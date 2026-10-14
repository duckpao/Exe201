const express = require('express')
const roommateController = require('../controllers/roommateController')
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware')
const { uploadImages, requireReviewVideo } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', roommateController.listRoommates)
router.get('/:id', optionalAuth, roommateController.getRoommate)
router.post('/', requireAuth, requirePostingAccess, uploadImages, requireReviewVideo, roommateController.createRoommate)

module.exports = router
