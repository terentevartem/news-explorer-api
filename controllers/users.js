const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const { jwtSecretDev } = require('../configs/dev-config');
const {
  invalidRequest,
  duplicateEmail,
  incorrectEmailOrPass,
  noUser,
} = require('../configs/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports.createUser = async (req, res, next) => {
  const { name, email } = req.body;
  const hash = await bcrypt.hash(req.body.password, 10);
  let userEmail;
  try {
    userEmail = await User.findOne({ email });
    if (!userEmail) {
      if (hash) {
        let user;
        try {
          user = await User.create({ name, email, password: hash });
        } catch (e) {
          return next(new BadRequestError(invalidRequest));
        }
        return res.status(201).send({
          _id: user._id,
          email: user.email,
        });
      }
    }
    return next(new BadRequestError(duplicateEmail));
  } catch (e) {
    return next(new BadRequestError(invalidRequest));
  }
};

// eslint-disable-next-line consistent-return
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findUserByCredentials(email, password);
  } catch (e) {
    return next(new UnauthorizedError(incorrectEmailOrPass));
  }
  res.send({
    token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDev, { expiresIn: '7d' }),
  });
};

// eslint-disable-next-line consistent-return
module.exports.findUserById = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError(noUser));
    }
  } catch (e) {
    return next(new BadRequestError(invalidRequest));
  }
  res.send({
    email: user.email,
    name: user.name,
  });
};
