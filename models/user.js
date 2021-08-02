const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const AuthorizationError = require('../errors/AuthorizationError');
const { errorMessages } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Введите корректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError(errorMessages.authorizationErrorMessageLogin));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizationError(errorMessages.authorizationErrorMessageLogin),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
