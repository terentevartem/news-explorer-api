const mongoose = require('mongoose');
const validate = require('validator');
require('mongoose-type-url');
const { invalidUrlFormat } = require('../configs/constants');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: mongoose.SchemaTypes.Url,
    required: true,
    validate: {
      validator: (v) => validate.isURL(v),
      message: invalidUrlFormat,
    },
  },
  image: {
    type: mongoose.SchemaTypes.Url,
    required: true,
    validate: {
      validator: (v) => validate.isURL(v),
      message: invalidUrlFormat,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
