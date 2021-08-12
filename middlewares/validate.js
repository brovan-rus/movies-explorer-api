const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const ValidationError = require('../errors/ValidationError');
const { errorMessages } = require('../utils/constants');

const validateEmptyBodyRequest = (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    throw new ValidationError(errorMessages.validationErrorMessage);
  }
  next();
};

const validateMovieCreate = celebrate({
  body: Joi.object().keys({
    country: Joi.string()
      .min(3)
      .regex(/[\wа-яё\s]/i)
      .max(56)
      .required(),
    director: Joi.string()
      .required()
      .regex(/[\wа-яё\s]/i),
    duration: Joi.number().required(),
    year: Joi.string().min(2).max(4).required(),
    description: Joi.string()
      .required()
      .regex(/[\wа-я.:!?"«»;@%№()*#,ё\s]/i),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) { return value; }
      return helpers.message('Поле image заполнено некорректно');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) { return value; }
      return helpers.message('Поле trailer заполнено некорректно');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) { return value; }
      return helpers.message('Поле thumbnail заполнено некорректно');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string()
      .regex(/[а-я.:!?"«»;@%№()*#,ё\s]/i)
      .required(),
    nameEN: Joi.string()
      .regex(/[\w.:!?"«»;@%№()*#,\s]/i)
      .required(),
  }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

const validateMovieIdParams = (req, res, next) => {
  const id = req.params.movieId;
  if (!(validator.isMongoId(id) && id)) {
    throw new ValidationError(errorMessages.validationErrorMessage);
  }
  next();
};

const validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3),
  }),
});

module.exports = {
  validateEmptyBodyRequest,
  validateMovieIdParams,
  validateLogin,
  validateUserCreate,
  validateProfileUpdate,
  validateMovieCreate,
};
