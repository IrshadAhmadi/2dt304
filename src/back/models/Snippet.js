const mongoose = require('mongoose')

const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

const Snippet = mongoose.model('Snippet', snippetSchema)
module.exports = Snippet
