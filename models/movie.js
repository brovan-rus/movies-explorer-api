const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    required: true,
  },

  director: {
    type: String,
    minlength: 2,
    required: true,
  },

  duration: {
    type: Number,
    minlength: 2,
    required: true,
  },

  year: {
    type: String,
    minlength: 2,
    required: true,
  },

  description: {
    type: String,
    minlength: 2,
    required: true,
  },

  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/{2}[\w\-._~:/?#[\]@!$&'()*+,;=]+/gi.test(v);
      },
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/{2}[\w\-._~:/?#[\]@!$&'()*+,;=]+/gi.test(v);
      },
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  nameRU: {
    type: String,
    minlength: 2,
    required: true,
    validate: {
      validator(v) {
        return /[а-я.:!?"«»;@%№()*#,ё\s]/gi.test(v);
      },
    },
  },

  nameEn: {
    type: String,
    minlength: 2,
    required: true,
    validate: {
      validator(v) {
        return /[\w.:!?"«»;@%№()*#,\s]/gi.test(v);
      },
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
