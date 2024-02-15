const Snippet = require('../models/Snippet')
const User = require('../models/User')
const hljs = require('highlight.js')
exports.newSnippetForm = (req, res) => {
  res.render('CreateSnippets', { user: req.user })
}

exports.createSnippet = async (req, res) => {
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
    res.status(500).render('error', { message: 'Error creating snippet. Please try again.' })
  }
}

exports.listSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find().lean()
    let user = null
    if (req.session.userId) {
      user = await User.findById(req.session.userId).lean()
    }
    res.render('listSnippets', { snippets, user })
  } catch (error) {
    console.error(error)
    res.status(500).render('error', { message: 'Error fetching snippets.' })
  }
}
exports.deleteSnippet = async (req, res, next) => {
  try {
    const { id } = req.params
    await Snippet.findByIdAndDelete(id)
    req.flash('success_msg', 'Deleted successfully.')
    res.redirect('/snippets')
  } catch (error) {
    next(error)
  }
}
