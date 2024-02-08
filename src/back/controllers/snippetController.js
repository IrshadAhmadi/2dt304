const Snippet = require('../models/Snippet')

exports.createSnippet = async (req, res) => {
  try {
    const { title, content, author } = req.body
    const newSnippet = new Snippet({ title, content, author })
    await newSnippet.save()
    req.flash('success_msg', 'Snippet created successfully.')
    res.redirect('/snippets')
  } catch (error) {
    console.error('Error creating snippet:', error)
    req.flash('error', 'Error creating snippet.')
    res.redirect('/snippets/new')
  }
}
