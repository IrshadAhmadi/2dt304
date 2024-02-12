const express = require('express')
const router = express.Router()
const User = require('../models/User')

// eslint-disable-next-line jsdoc/require-returns, jsdoc/multiline-blocks
/**
 *
 * @param req
 * @param res
 * @param next
 * */
function ensureAuthenticated (req, res, next) {
  if (req.session.userId) {
    return next()
  } else {
    req.flash('error_msg', 'Please log in to view the dashboard')
    return res.redirect('/users/login')
  }
}

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
    if (!user) {
      req.flash('error_msg', 'User not found.')
      return res.redirect('/users/login')
    }
    res.render('dashboard', { user })
  } catch (err) {
    console.error('Error fetching user:', err)
    req.flash('error_msg', 'An error occurred.')
    return res.redirect('/')
  }
})

module.exports = router
