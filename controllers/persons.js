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

    const persons = await Person.find({ user: decodedToken.id }).populate(
      'user',
      {
        username: 1,
        name: 1,
      }
    )
    res.json(persons)
  } else {
    // if user no auth should not fetch any data
    res.json([])
  }
})

personsRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

personsRouter.put('/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((person) => {
      res.json(person)
    })
    .catch((error) => {
      console.log('no number')
      return next(error)
    })
})

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = personsRouter
