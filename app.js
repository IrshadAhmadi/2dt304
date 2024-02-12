const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const app = express()

// Database Connection
mongoose.connect('mongodb://localhost:27017/crud')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// Middleware Setup
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false,
  cookie: { secure: false }
}))
app.use(flash())

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

// View Engine Setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'front', 'views'))

// Routes
const indexRoutes = require('./src/back/routes/main')
const userRoutes = require('./src/back/routes/users')
const snippetRoutes = require('./src/back/routes/snippets')
const dashboardRoutes = require('./src/back/routes/dashboardRoutes')

app.use((err, req, res, next) => {
  console.error(err.stack)
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).render('error', { message })
})
app.use((req, res, next) => {
  res.locals.currentPath = req.originalUrl
  next()
})
app.use('/', indexRoutes)
app.use('/users', userRoutes)
app.use('/snippets', snippetRoutes)
app.use(dashboardRoutes)

// Server Initialization
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
