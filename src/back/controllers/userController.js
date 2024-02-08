const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Email already in use, try with a different Email' })
      }
      if (userExists.username === username) {
        return res.status(400).json({ message: 'Username already taken, try with a different username' })
      }
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password
    })

    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
exports.loginUser = async (req, res) => {
  const { username, password } = req.body
  // Logic to authenticate user
  const user = await User.findOne({ username })
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user._id
    return res.redirect('/dashboard')
  } else {
    req.flash('error_msg', 'Invalid username or password')
    return res.redirect('/users/login')
  }
}

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/?logout=success')
  })
}
