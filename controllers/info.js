const infoRouter = require('express').Router()
const Person = require('../models/person')

infoRouter.get('/', (req, res, next) => {
  const date = new Date()

  Person.find({})
    .then((persons) => {
      res.send(
        `<p>Phonebook has info for ${persons.length}</p>
        <p>${date}</p>`
      )
    })
    .catch((error) => next(error))
})

module.exports = infoRouter
