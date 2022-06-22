const morgan = require('morgan')
const logger = require('./logger')

const requestLogger = () =>
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ')
  })

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  switch (error.name) {
    case 'CastError':
      return res.status(400).json({ error: 'Malformatted ID' })
    case 'ValidationError':
      return res.status(400).json({ error: error.message })
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'Invalid token.' })
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'Token expired.' })
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
