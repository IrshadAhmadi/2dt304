// src/back/middlewares/auth.js

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param req
 * @param res
 * @param next
 */
function checkAuthenticated (req, res, next) {
  if (req.session.userId) {
    return next()
  }
  res.status(403).send('Forbidden')
}

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param req
 * @param res
 * @param next
 */
function checkOwnership (req, res, next) {
  if (req.snippet && req.snippet.author.toString() === req.session.userId.toString()) {
    return next()
  }
  res.status(403).send('Forbidden')
}

module.exports = { checkAuthenticated, checkOwnership }
