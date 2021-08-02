const routes = require('express').Router();
const { validateUserCreate, validateLogin } = require('../middlewares/validate');
const { createUser, login } = require('../controllers/user');
const movieRoutes = require('./movie');
const userRoutes = require('./user');
const auth = require('../middlewares/auth');

routes.post('/signup', validateUserCreate, createUser);
routes.post('/signin', validateLogin, login);
routes.use(auth);
routes.use('/movies', movieRoutes);
routes.use('/users', userRoutes);

module.exports = routes;
