const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('phonebookEntries', {
    name: 1,
    number: 1,
  })
  res.json(users)
})

// TODO stronger user creation validation policy
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  // treat cuz model takes hash
  if (password === '') {
    return res.status(400).json({ error: 'Empty password.' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists.' })
  }

  const saltRounds = 12
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  res.status(201).json({ token, username: user.username, name: user.name })
})

module.exports = usersRouter
