const routerUsers = require('express').Router();
const { findUserById } = require('../controllers/users');

routerUsers.get('/me', findUserById);

module.exports = routerUsers;
