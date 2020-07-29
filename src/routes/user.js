const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/user');
const router = new express.Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router.post('/user', urlencodedParser, userController.postUserInfo);

module.exports = router;
