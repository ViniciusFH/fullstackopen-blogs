const morgan = require('morgan');
const logger = require('./logger');
const authDecoder = require('./authDecoder');
const NewError = require('./error');

function errorHandler(error, _req, res, next) {
  logger.error(error);
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.message === 'data and salt arguments required') {
    return res.status(400).json({ error: 'password is required' });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  } else if (error.name === 'InvalidUser') {
    return res.status(403).json({ error: 'action forbidden for this user' });
  }

  next(error);
}

function unknownEndpoint(_req, res) {
  res.status(404).json({ error: 'unknown endpoint' });
}

function userExtractor(req, _res, next) {
  const user = authDecoder(req);

  if (!user) NewError('JsonWebTokenError', 'invalid token');

  req.user = user;

  next();
}

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

module.exports = {
  errorHandler,
  unknownEndpoint,
  requestLogger,
  userExtractor,
};
