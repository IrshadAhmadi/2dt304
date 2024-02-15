const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const methodOverride = require('method-override')
const mainRouters = require('./src/back/routes/mainRouters')

const app = express()

// Database Connection
mongoose.connect('mongodb://localhost:27017/crud')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false
}))
app.use(flash())
app.use(methodOverride('_method'))

// View Engine Setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'front', 'views'))

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.session.user
  next()
})

// Routes
app.use('/', mainRouters)

app.use((err, req, res, next) => {
  console.error(err.stack)
  const statusCode = err.statusCode || 500
  const message = err.message || 'error'
  const backUrl = req.header('Referer') || '/'
  res.status(statusCode).render('error', { message, backUrl })
})

// Server Initialization
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
