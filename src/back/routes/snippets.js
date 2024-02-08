const express = require('express')
const router = express.Router()
const Snippet = require('../models/Snippet')

router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find().lean()
    res.render('snippets', { snippets })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error loading snippets')
  }
})

module.exports = router
