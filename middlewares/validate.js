const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const ValidationError = require('../errors/ValidationError');

const validateEmptyBodyRequest = (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    throw new ValidationError('Переданы некорректные данные');
  }
  next();
};

const validateMovieLinks = (req, res, next) => {
  const { image, trailer, thumbnail } = req.body.link;
  if (
    !(
      validator.isURL(image, { require_protocol: true }) &&
      validator.isURL(trailer, { require_protocol: true }) &&
      validator.isURL(thumbnail, { require_protocol: true })
    )
  ) {
    throw new ValidationError('Переданы некорректные данные');
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
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
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
    throw new ValidationError('Переданы некорректные данные');
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
  validateMovieLinks,
  validateMovieIdParams,
  validateLogin,
  validateUserCreate,
  validateProfileUpdate,
  validateMovieCreate,
};