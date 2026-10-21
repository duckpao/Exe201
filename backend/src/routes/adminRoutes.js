const express = require('express')
const adminListingController = require('../controllers/adminListingController')
const adminUserController = require('../controllers/adminUserController')
const adminSubscriptionController = require('../controllers/adminSubscriptionController')
const { requireAuth, requireRole } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(requireAuth, requireRole('admin'))
router.get('/overview', adminUserController.getOverview)
router.get('/subscriptions', adminSubscriptionController.listSubscriptions)
router.post('/subscriptions/grant', adminSubscriptionController.grantSubscription)
router.post('/subscriptions/:id/revoke', adminSubscriptionController.revokeSubscription)
router.get('/users', adminUserController.listUsers)
router.patch('/users/:id', adminUserController.updateUser)
router.get('/listings', adminListingController.listListings)
router.post('/listings/:type/:id/hide', adminListingController.hideListing)
router.post('/listings/:type/:id/unhide', adminListingController.unhideListing)

module.exports = router
