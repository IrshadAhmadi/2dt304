const express = require('express')
const router = express.Router()
const Snippet = require('../models/Snippet')

// Home page route
router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find().lean()
    res.render('main', { snippets })
  } catch (err) {
    console.error(err)
    res.redirect('/')
  }
})

module.exports = router
