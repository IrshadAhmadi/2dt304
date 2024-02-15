// Async wrapper to catch errors from async routes and pass them to the Express error handler
/**
 *
 * @param fn
 */
function catchAsyncErrors (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Error handler to set error response
/**
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  console.error(err.stack)
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).render('error', { message })
}

module.exports = {
  catchAsyncErrors,
  errorHandler
}
