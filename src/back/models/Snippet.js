const mongoose = require('mongoose')

const SnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Snippet = mongoose.model('Snippet', SnippetSchema)

module.exports = Snippet
