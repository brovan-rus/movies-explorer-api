const Movie = require('../models/movie');
const { serverMessages } = require('../utils/constants');

const getAllMovies = async (req, res, next) => {
  const moviesList = await Movie.find({}).catch(next);
  res.status(200).send({ data: moviesList });
};

const createNewMovie = async (req, res, next) => {
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
  const newMovieEntry = await Movie.create({
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
  }).catch(next);
  res.status(201).send({ data: newMovieEntry });
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  await Movie.checkMovieEntryOwner(movieId, req.user).catch(next);
  await Movie.deleteOne({ _id: movieId }).catch(next);
  res.status(200).send({ message: serverMessages.movieDeleteMessage });
};

module.exports = { getAllMovies, createNewMovie, deleteMovie };
