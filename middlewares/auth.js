const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { errorMessages } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError(errorMessages.authorizationErrorMessageJWT));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError(errorMessages.authorizationErrorMessageJWT));
  }
  req.user = payload._id;
  next();
};
