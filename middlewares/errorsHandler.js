const { errorMessages } = require('../utils/constants');

const errorsHandler = (err, req, res, next) => {
  const { errCode = 500, message = errorMessages.serverErrorMessage } = err;
  res.status(errCode).send({ message });
  console.log(err);
};

module.exports = errorsHandler;
