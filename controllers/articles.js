const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send({ data: articles }))
    .catch(() => {
      throw new BadRequestError('Неверный запрос');
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch(() => {
      throw new BadRequestError('Неверный запрос');
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.id).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Такой карточки не существует');
      }
      if (JSON.stringify(article.owner) !== JSON.stringify(req.user._id)) {
        throw new BadRequestError('Вы не можете удалять чужие карточки!');
      }

      res.send(article);
    })
    .catch(next);
};
