// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param req
 * @param res
 * @param next
 */
function ensureAuthenticated (req, res, next) {
  if (req.session.userId) {
    next()
  } else {
    req.flash('error_msg', 'Please log in to access this resource.')
    res.redirect('/users/login')
  }
}
module.exports = { ensureAuthenticated }
