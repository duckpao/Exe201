const express = require('express')
const reviewController = require('../controllers/reviewController')
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:type/:id', optionalAuth, reviewController.listReviews)
router.put('/:type/:id', requireAuth, reviewController.saveReview)
router.delete('/:type/:id', requireAuth, reviewController.deleteReview)

module.exports = router
