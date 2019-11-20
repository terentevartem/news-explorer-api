require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { mongoUrl } = require('./configs/dev-config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routerArticles = require('./routes/articles');
const routerUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const auth = require('./middlewares/auth');
const {
  SERVER_ERROR,
  SERVER_CRASH,
  NOT_FOUND,
  LIMITER_WINDOW_MS,
  LIMITER_MAX,
} = require('./configs/constants');

const app = express();
const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: LIMITER_WINDOW_MS,
  max: LIMITER_MAX,
});

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(SERVER_CRASH);
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

// app.use(auth);

app.use('/articles', routerArticles);
app.use('/users', routerUsers);

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND));
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? SERVER_ERROR : message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
