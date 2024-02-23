/**
 * Middleware to ensure a user is authenticated. If the user is authenticated,
 * it proceeds to the next, otherwise, it responds with an error or redirects to the login page.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 */
function ensureAuthenticated (req, res, next) {
  if (req.session.userId) {
    next()
  } else {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(401).json({ message: 'Please log in to access this resource.' })
    } else {
      req.flash('error_msg', 'Please log in to access this resource.')
      res.redirect('/users/login')
    }
  }
}

/**
 * Middleware to set up local variables for use in views,
 * It attaches flash messages and user information.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 */
function setupLocals (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.session.user
  next()
}

module.exports = { ensureAuthenticated, setupLocals }
