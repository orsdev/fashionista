const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/user');
const userRouter = new express.Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

userRouter.get('/', userController.getHomePage);

userRouter.post('/user', urlencodedParser, userController.postUserInfo);

module.exports = userRouter;
