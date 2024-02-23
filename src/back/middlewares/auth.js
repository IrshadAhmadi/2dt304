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
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(401).json({ message: 'Please log in to access this resource.' })
    } else {
      req.flash('error_msg', 'Please log in to access this resource.')
      res.redirect('/users/login')
    }
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function setupLocals (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.session.user
  next()
}
module.exports = { ensureAuthenticated, setupLocals }
