const userRoutes = require('express').Router();
const { findUser, updateProfile } = require('../controllers/user');
const { validateEmptyBodyRequest, validateProfileUpdate } = require('../middlewares/validate');

userRoutes.get('/me', validateEmptyBodyRequest, findUser);
userRoutes.patch('/me', validateProfileUpdate, updateProfile);

module.exports = userRoutes;
