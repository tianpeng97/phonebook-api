const personsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Person = require('../models/person')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }

  return null
}

personsRouter.post('/', async (req, res) => {
  const { name, number } = req.body
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Token missing or invalid.' })
  }

  const user = await User.findById(decodedToken.id)

  // new person
  const person = new Person({
    name,
    number,
    user: user._id,
  })

  const savedPerson = await person.save()
  user.phonebookEntries = user.phonebookEntries.concat(savedPerson._id)
  await user.save()

  res.json(savedPerson)
})

personsRouter.get('/', async (req, res) => {
  const token = getTokenFrom(req)
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token missing or invalid.' })
    }

    const persons = await Person.find({ user: decodedToken.id })
    // if want to populate
    // .populate('user', {
    //   username: 1,
    //   name: 1,
    // })
    res.json(persons)
  } else {
    // if user no auth should not fetch any data
    res.json([])
  }
})

// TODO
personsRouter.get('/:id', async (req, res) => {
  const person = await Person.findById(req.params.id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

personsRouter.put('/:id', async (req, res) => {
  const token = getTokenFrom(req)
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token missing or invalid.' })
    }

    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    })

    // if already deleted
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({ error: 'Content already deleted.' })
    }
  } else {
    // TODO ERROR HANDLING
  }
})

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = personsRouter
