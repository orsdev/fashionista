const express = require('express');
const bodyParser = require('body-parser');
const userRouter = new express.Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

userRouter.get('/', async (req, res) => {
  res.render('home');
});

userRouter.post('/user', urlencodedParser, async (req, res) => {
  res.send('register user')
});

module.exports = userRouter;
