const express = require('express')
const passRoomController = require('../controllers/passRoomController')
const { requireAuth } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', passRoomController.listPassRooms)
router.get('/:id', passRoomController.getPassRoom)
router.post('/', requireAuth, requirePostingAccess, uploadImages, passRoomController.createPassRoom)
router.patch('/:id/status', requireAuth, passRoomController.updatePassRoomStatus)

module.exports = router
