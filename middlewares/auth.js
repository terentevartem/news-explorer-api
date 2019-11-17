const jwt = require('jsonwebtoken');
const { jwtSecretDev } = require('../configs/dev-config');
const { needAuthorization } = require('../configs/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: needAuthorization });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDev);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
