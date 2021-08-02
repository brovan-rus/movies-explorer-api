const movieRoutes = require('express').Router();

const { getAllMovies, createNewMovie, deleteMovie } = require('../controllers/movie');
const {
  validateEmptyBodyRequest,
  validateMovieCreate,
  validateMovieIdParams,
} = require('../middlewares/validate');

movieRoutes.get('/', validateEmptyBodyRequest, getAllMovies);
movieRoutes.post('/', validateMovieCreate, createNewMovie);
movieRoutes.delete('/:movieId', validateEmptyBodyRequest, validateMovieIdParams, deleteMovie);

module.exports = movieRoutes;
