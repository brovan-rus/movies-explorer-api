const Movie = require('../models/movie');
const { serverMessages } = require('../utils/constants');

const getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((allMovies) => res.status(200).send({ data: allMovies }))
    .catch(next);
};

const createNewMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((newMovieEntry) => res.status(201).send({ data: newMovieEntry }))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.checkMovieEntryOwner(movieId, req.user)
    .then(() => Movie.deleteOne({ _id: movieId }))
    .then(() => res.status(200).send({ message: serverMessages.movieDeleteMessage }))
    .catch(next);
};

module.exports = { getAllMovies, createNewMovie, deleteMovie };
