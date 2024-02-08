const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/register', userController.registerUser)

router.get('/register', (req, res) => {
  res.render('register')
})
router.get('/login', (req, res) => res.render('login'))
router.post('/login', userController.loginUser)

router.get('/logout', userController.logoutUser)

module.exports = router
