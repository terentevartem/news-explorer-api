const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const { invalidMailFormat, incorrectEmailOrPass } = require('../configs/constants');

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
      message: invalidMailFormat,
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
        return Promise.reject(new Error(incorrectEmailOrPass));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(incorrectEmailOrPass));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
