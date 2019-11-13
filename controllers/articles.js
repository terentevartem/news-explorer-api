const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');

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
  Article.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((article) => {
      if (!article) return Promise.reject(new Error('Такой карточки не существует'));
      if (JSON.stringify(article.owner) !== JSON.stringify(req.user._id)) return Promise.reject(new Error('Вы не можете удалять чужие карточки!'));
      Article.remove(article)
        // eslint-disable-next-line no-shadow
        .then((article) => res.send({ data: article }))
        .catch(() => {
          throw new BadRequestError('Неверный запрос');
        })
        .catch(next);
    })
    .catch(() => {
      throw new BadRequestError('Неверный запрос');
    })
    .catch(next);
};
