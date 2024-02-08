const express = require('express')
const router = express.Router()
const Snippet = require('../models/Snippet')

router.get('/new', (req, res) => {
  res.render('CreateSnippets')
})

// create snippet
router.post('/', async (req, res) => {
  const { title, content, author } = req.body
  try {
    const newSnippet = new Snippet({ title, content, author })
    await newSnippet.save()
    res.redirect('/snippets')
  } catch (error) {
    console.error('Error creating snippet:', error)
    res.redirect('/snippets/new')
  }
})

// list snippets
router.get('/', async (req, res) => {
  const snippets = await Snippet.find()
  res.render('listSnippets', { snippets })
})

module.exports = router
