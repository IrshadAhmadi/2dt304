const express = require('express')
const router = express.Router()
const Snippet = require('../models/Snippet')
const User = require('../models/User')

router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find().lean()
    let user = null

    if (req.session.userId) {
      user = await User.findById(req.session.userId).lean()
    }
    res.render('main', { snippets, user, success_msg: req.flash('success_msg') })
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'An error occurred fetching the snippets.')
    res.redirect('/')
  }
})

module.exports = router
