require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const limiter = require('./middlewares/rate-limiter');
const routes = require('./routes/index');
const errorsHandler = require('./middlewares/errorsHandler');
const { errorMessages } = require('./utils/constants');

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(routes);

mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(`Произошла ошибка подключения к базе данных ${err}`));

app.use((req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundOnSiteErrorMessage));
});

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(port, () => {
  console.log(`We are live on ${port}`);
});
