const express = require('express')
const router = express.Router()

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param req
 * @param res
 * @param next
 */
function ensureAuthenticated (req, res, next) {
  if (req.session.userId) {
    return next()
  } else {
    req.flash('error_msg', 'Please log in to view the dashboard')
    return res.redirect('/users/login')
  }
}
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard')
})

module.exports = router
