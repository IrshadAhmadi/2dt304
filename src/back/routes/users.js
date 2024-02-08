const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User') // Make sure this path is correct

// Registration Page
router.get('/register', (req, res) => {
  res.render('register') // Ensure you have a register.ejs view
})

// Handle Registration
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body
  const errors = []

  // Simple validation
  if (!firstName || !lastName || !email || !username || !password) {
    errors.push({ msg: 'Please enter all fields' })
  }

  // Check for errors before proceeding
  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      email,
      username,
      password
    })
  } else {
    // Check if username or email already exists
    try {
      const userByUsername = await User.findOne({ username })
      const userByEmail = await User.findOne({ email })

      if (userByUsername || userByEmail) {
        if (userByUsername) {
          errors.push({ msg: 'Username already exists' })
        }
        if (userByEmail) {
          errors.push({ msg: 'Email already exists' })
        }
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          username,
          password
        })
      } else {
        // Create a new user object
        const newUser = new User({
          firstName,
          lastName,
          email,
          username,
          password // Will be hashed below
        })

        bcrypt.genSalt(10, (_err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err
            newUser.password = hash
            await newUser.save()
            req.flash('success_msg', 'You are now registered and can log in')
            res.redirect('/users/login')
          })
        })
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Error registering the user')
    }
  }
})

module.exports = router
