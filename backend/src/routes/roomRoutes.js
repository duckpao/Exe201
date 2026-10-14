const express = require('express')
const roomController = require('../controllers/roomController')
const { requireAuth, requireRole, optionalAuth } = require('../middleware/authMiddleware')
const { uploadImages, requireReviewVideo } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', roomController.listRooms)
router.get('/:id', optionalAuth, roomController.getRoom)
router.post('/', requireAuth, requireRole('landlord'), requirePostingAccess, uploadImages, requireReviewVideo, roomController.createRoom)

module.exports = router
