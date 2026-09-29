const express = require('express')
const userController = require('../controllers/userController')
const { requireAuth } = require('../middleware/authMiddleware')
const multer = require('multer')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'))
    }
  }
})

const router = express.Router()

router.put('/profile', requireAuth, upload.single('avatar'), userController.updateProfile)
router.put('/password', requireAuth, userController.changePassword)
router.get('/listings', requireAuth, userController.myListings)
router.put('/listings/:type/:id', requireAuth, userController.updateListing)
router.delete('/listings/:type/:id', requireAuth, userController.deleteListing)

module.exports = router
