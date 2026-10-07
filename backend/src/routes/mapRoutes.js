const express = require('express')
const mapController = require('../controllers/mapController')

const router = express.Router()

router.get('/autocomplete', mapController.autocomplete)
router.get('/place', mapController.getPlace)

module.exports = router