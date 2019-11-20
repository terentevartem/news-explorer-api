const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const { INVALID_MAIL_FORMAT, INCORRECT_EMAIL_OR_PASS } = require('../configs/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validate.isEmail(v),
      message: INVALID_MAIL_FORMAT,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(INCORRECT_EMAIL_OR_PASS));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(INCORRECT_EMAIL_OR_PASS));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
