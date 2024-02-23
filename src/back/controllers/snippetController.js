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
    const snippets = await Snippet.find().populate('author').lean()
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
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authorized.' })
    }

    const snippet = await Snippet.findById(id)
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found.' })
    }

    if (snippet.author.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this snippet.' })
    }

    await Snippet.findByIdAndDelete(id)
    res.json({ message: 'Deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred.' })
  }
}

exports.editSnippetForm = async (req, res) => {
  try {
    const { id } = req.params
    const snippet = await Snippet.findById(id)
    if (!snippet) {
      req.flash('error_msg', 'Snippet not found')
      return res.redirect('/snippets')
    }

    if (snippet.author.toString() !== req.session.userId.toString()) {
      req.flash('error_msg', 'Not authorized to edit this snippet.')
      return res.redirect('/snippets')
    }

    res.render('updateSnippet', { snippet })
  } catch (error) {
    req.flash('error_msg', 'An error occurred.')
    res.redirect('/snippets')
  }
}

exports.updateSnippet = async (req, res) => {
  const { title, content, language } = req.body
  const { id } = req.params
  try {
    const snippet = await Snippet.findById(id)
    if (!snippet) {
      req.flash('error_msg', 'Snippet not found.')
      return res.redirect('/snippets')
    }

    if (snippet.author.toString() !== req.session.userId.toString()) {
      req.flash('error_msg', 'Not authorized to edit this snippet.')
      return res.redirect('/snippets')
    }

    await Snippet.findByIdAndUpdate(id, { title, content, language })
    req.flash('success_msg', 'Snippet updated successfully.')
    res.redirect('/snippets')
  } catch (error) {
    console.error(error)
    req.flash('error_msg', 'Error updating snippet.')
    res.redirect(`/snippets/edit/${id}`)
  }
}
