const express = require('express')
const vehicleController = require('../controllers/vehicleController')
const { requireAuth } = require('../middleware/authMiddleware')
const { uploadImages } = require('../middleware/upload')

const router = express.Router()

router.get('/', vehicleController.listVehicles)
router.get('/:id', vehicleController.getVehicle)
router.post('/', requireAuth, uploadImages, vehicleController.createVehicle)
router.post('/:id/bookings', requireAuth, vehicleController.createBooking)

module.exports = router
