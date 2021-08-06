const errorMessages = {
  validationErrorMessage: 'Переданы некорректные данные',
  emailConflictErrorMessage: 'Пользователь с данным email уже существует',
  authorizationErrorMessageJWT: 'Необходима авторизация',
  authorizationErrorMessageLogin: 'Неправильный email или пароль',
  notFoundErrorDBMessage: 'Запрашиваемая запись не найдена',
  forbiddenErrorMessage: 'Недостаточно прав для совершения действия',
  notFoundOnSiteErrorMessage: 'Запрашиваемый ресурс не найден',
  notFoundUserErrorMessage: 'Запрашиваемый пользователь не найден',
  serverErrorMessage: 'Ошибка сервера',
  corsErrorMessage: 'Запрещено политикой CORS',
};

const serverMessages = {
  movieDeleteMessage: 'Запись о фильме удалена',
};

const whitelist = ['http://localhost:3000', 'https://localhost:3000'];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(errorMessages.corsErrorMessage));
    }
  },
};

module.exports = { errorMessages, corsOptions, serverMessages };
