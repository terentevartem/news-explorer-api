const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const { invalidRequest, noArticle, noAccess } = require('../configs/constants');

// eslint-disable-next-line consistent-return
module.exports.getArticles = async (req, res, next) => {
  let articles;
  try {
    articles = await Article.find({ owner: req.user._id });
  } catch (e) {
    return next(new BadRequestError(invalidRequest));
  }
  res.send({ data: articles });
};

// eslint-disable-next-line consistent-return
module.exports.createArticle = async (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  let article;
  try {
    article = await Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user._id,
    });
  } catch (e) {
    return next(new BadRequestError(invalidRequest));
  }
  res.send({ data: article });
};

// eslint-disable-next-line consistent-return
module.exports.deleteArticle = async (req, res, next) => {
  let article;
  try {
    article = await Article.findById(req.params.id).select('+owner');
    if (!article) {
      return next(new NotFoundError(noArticle));
    }
    if (JSON.stringify(article.owner) === JSON.stringify(req.user._id)) {
      try {
        article = await Article.findByIdAndRemove(req.params.id);
      } catch (e) {
        return next(new BadRequestError(invalidRequest));
      }
      return res.send({ data: article });
    }
    return next(new BadRequestError(noAccess));
  } catch (e) {
    return next(new BadRequestError(invalidRequest));
  }
};
