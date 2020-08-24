const express = require('express');
const authController = require('../controllers/auth');

const router = new express.Router();

router.get('/login', authController.getLoginPage);

router.get('/register', authController.getRegisterPage);

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser);

router.post('/register', authController.postCreateUser);

module.exports = router;
