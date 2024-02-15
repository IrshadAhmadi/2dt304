const Snippet = require('../models/Snippet')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.showMainPage = async (req, res) => {
  try {
    const snippets = await Snippet.find().lean()
    let user = null

    if (req.session.userId) {
      user = await User.findById(req.session.userId).lean()
    }
    res.render('main', { snippets, user, success_msg: req.flash('success_msg') })
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'An error occurred fetching the snippets.')
    res.redirect('/')
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user._id
      res.redirect('/dashboard')
    } else {
      req.flash('error_msg', 'Invalid username or password')
      res.redirect('/users/login')
    }
  } catch (error) {
    next(error)
  }
}
exports.getLoginPage = (req, res) => {
  res.render('login', { user: req.user })
}
exports.getRegisterPage = (req, res) => {
  res.render('register', { user: req.user })
}

exports.registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password } = req.body
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (userExists) {
      const error = new Error('Email or username already in use')
      error.statusCode = 400
      throw error
    }

    const newUser = new User({ firstName, lastName, email, username, password })
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    next(error)
  }
}
exports.showDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId)
    if (!user) {
      throw new Error('User not found')
    }
    res.render('dashboard', { user })
  } catch (error) {
    next(error)
  }
}
exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      // eslint-disable-next-line no-undef
      return next(err)
    }
    res.redirect('/?logout=success')
  })
}
