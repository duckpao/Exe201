const express = require('express')
const vehicleController = require('../controllers/vehicleController')
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware')
const { uploadImages, requireReviewVideo } = require('../middleware/upload')
const { requirePostingAccess } = require('../middleware/postingPaymentMiddleware')

const router = express.Router()

router.get('/', optionalAuth, vehicleController.listVehicles)
router.get('/:id', optionalAuth, vehicleController.getVehicle)
router.post('/', requireAuth, requirePostingAccess, uploadImages, requireReviewVideo, vehicleController.createVehicle)
router.post('/:id/bookings', requireAuth, vehicleController.createBooking)

module.exports = router
