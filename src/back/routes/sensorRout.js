const express = require('express')
const router = express.Router()
const sensorController = require('../controllers/sensorController')

router.get('/', sensorController.viewCarData)
router.post('/api/data', sensorController.addCarData)

module.exports = router
