const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const DataConflictError = require('../errors/DataConflictError');
const { errorMessages } = require('../utils/constants');

const findUser = (req, res, next) => {
  const id = req.user;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError(errorMessages.notFoundUserErrorMessage);
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ email, about, avatar, name, password: hash }).then(() =>
        res.status(201).send({ data: { name, about, avatar, email } }),
      ),
    )
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new DataConflictError(errorMessages.emailConflictErrorMessage));
      }
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.updateOne({ _id: req.user }, { name, email }, { runValidators: true, new: true })
    .orFail(() => new NotFoundError(errorMessages.notFoundUserErrorMessage))
    .then(() => res.status(200).send({ data: { name, email } }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new DataConflictError(errorMessages.emailConflictErrorMessage));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  findUser,
  createUser,
  updateProfile,
  login,
};
