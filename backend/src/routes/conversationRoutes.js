const express = require('express')
const conversationController = require('../controllers/conversationController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', requireAuth, conversationController.startConversation)
router.get('/', requireAuth, conversationController.listConversations)
router.get('/:id/messages', requireAuth, conversationController.getMessages)
router.post('/:id/messages', requireAuth, conversationController.postMessage)

module.exports = router
