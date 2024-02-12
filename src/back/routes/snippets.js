const express = require('express')
const router = express.Router()
const Snippet = require('../models/Snippet')
const hljs = require('highlight.js')

router.get('/new', (req, res) => {
  if (!req.session.userId) {
    req.flash('error_msg', 'Please log in to create a snippet.')
    return res.redirect('/users/login')
  }
  res.render('CreateSnippets')
})

// Create snippet
router.post('/', async (req, res) => {
  const { title, content } = req.body
  const author = req.session.userId
  const detectedLanguage = hljs.highlightAuto(content).language

  try {
    const newSnippet = new Snippet({
      title,
      content,
      author,
      language: detectedLanguage
    })
    await newSnippet.save()
    req.flash('success_msg', 'Snippet created successfully.')
    res.redirect('/snippets')
  } catch (error) {
    console.error('Error creating snippet:', error)
    req.flash('error_msg', 'Error creating snippet. Please try again.')
    res.redirect('/snippets/new')
  }
})

// List snippets
router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find().lean()
    res.render('listSnippets', { snippets })
  } catch (error) {
    console.error(error)
    req.flash('error_msg', 'Error fetching snippets.')
    res.status(500).render('error', { message: 'Error fetching snippets.' })
  }
})

module.exports = router
