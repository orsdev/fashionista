const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/user');

const router = new express.Router();

const jsonParser = bodyParser.json();

router.post('/user', jsonParser, userController.postUserInfo);

module.exports = router;
