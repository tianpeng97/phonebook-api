const express = require('express')
require('express-async-errors')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const app = express()
const personsRouter = require('./controllers/persons')
const infoRouter = require('./controllers/info')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((err) => {
    logger.error(err.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger())

app.use('/info', infoRouter)
app.use('/api/persons', personsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
