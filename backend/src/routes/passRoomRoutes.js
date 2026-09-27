const express = require('express')
const passRoomController = require('../controllers/passRoomController')
const { requireAuth } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')

const router = express.Router()

router.get('/', passRoomController.listPassRooms)
router.get('/:id', passRoomController.getPassRoom)
router.post('/', requireAuth, uploadImages, passRoomController.createPassRoom)
router.patch('/:id/status', requireAuth, passRoomController.updatePassRoomStatus)

module.exports = router
