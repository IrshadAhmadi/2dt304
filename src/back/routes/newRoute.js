const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middlewares/auth')
const userController = require('../controllers/userController')
const snippetController = require('../controllers/snippetController')

router.get('/', userController.showMainPage)
router.get('/users/login', userController.getLoginPage)
router.post('/users/login', userController.loginUser)
router.get('/users/logout', userController.logoutUser)
router.get('/dashboard', ensureAuthenticated, userController.showDashboard)
router.get('/users/register', userController.getRegisterPage)
router.post('/users/register', userController.registerUser)
router.get('/snippets/new', ensureAuthenticated, snippetController.newSnippetForm)
router.post('/snippets', ensureAuthenticated, snippetController.createSnippet)
router.get('/snippets', snippetController.listSnippets)
router.post('/snippets/delete/:id', snippetController.deleteSnippet)

module.exports = router