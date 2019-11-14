# API для аутентификации пользователей и сохранения статей.

API приложение располагается на домене:
**http://api.news-explorer.ga/**

##### GET /users/me
> Ввозвращает информацию о пользователе (email и имя)

##### GET /articles
> Возвращает все сохранённые статьи

##### POST /articles
> Создаёт статью с переданными в теле
> - keyword
> - title
> - text
> - date
> - source
> - link
> - image

##### DELETE /articles/articleId
> Удаляет статью по _id

##### POST /signup
>  создаёт пользователя с переданными в теле
> - email
> - password
> - name

##### POST /signin
> проверяет переданные в теле почту и пароль и возвращает JWT
