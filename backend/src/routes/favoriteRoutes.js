const express = require('express')
const favoriteController = require('../controllers/favoriteController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', requireAuth, favoriteController.addFavorite)
router.get('/', requireAuth, favoriteController.listFavorites)
router.get('/check/:entityType/:entityId', requireAuth, favoriteController.checkFavorite)
router.delete('/:entityType/:entityId', requireAuth, favoriteController.removeFavorite)

module.exports = router
