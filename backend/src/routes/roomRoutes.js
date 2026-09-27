const express = require('express')
const roomController = require('../controllers/roomController')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')

const router = express.Router()

router.get('/', roomController.listRooms)
router.get('/:id', roomController.getRoom)
router.post('/', requireAuth, requireRole('landlord'), uploadImages, roomController.createRoom)

module.exports = router
