const express = require('express')
const roommateController = require('../controllers/roommateController')
const { requireAuth } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')

const router = express.Router()

router.get('/', roommateController.listRoommates)
router.get('/:id', roommateController.getRoommate)
router.post('/', requireAuth, uploadImages, roommateController.createRoommate)

module.exports = router
