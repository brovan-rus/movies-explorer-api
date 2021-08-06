const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const DataConflictError = require('../errors/DataConflictError');
const { errorMessages } = require('../utils/constants');

const findUser = async (req, res, next) => {
  const id = req.user;
  const user = await User.findById(id)
    .orFail(() => {
      throw new NotFoundError(errorMessages.notFoundUserErrorMessage);
    })
    .catch(next);
  res.status(200).send({ data: user });
};

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10).catch(next);
  await User.create({ email, name, password: hash })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new DataConflictError(errorMessages.emailConflictErrorMessage));
      } else {
        next(err);
      }
    });
  res.status(201).send({ data: { name, email } });
};

const updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    await User
      .updateOne({ _id: req.user }, { name, email }, { runValidators: true, new: true })
      .orFail(() => new NotFoundError(errorMessages.notFoundUserErrorMessage));
    res.status(200).send({ data: { name, email } });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      next(new DataConflictError(errorMessages.emailConflictErrorMessage));
    } else next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findUserByCredentials(email, password).catch(next);
  const token = jwt.sign(
    { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
  );
  res.status(200).send({ token });
};

module.exports = {
  findUser,
  createUser,
  updateProfile,
  login,
};
