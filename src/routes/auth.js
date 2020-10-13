const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');

const validateLogin = (bodyWrapper) => [
  bodyWrapper('userEmail')
    .isEmail()
    .withMessage('Enter a valid email address.')
    .notEmpty()
    .withMessage('Enter your email address.')
    .normalizeEmail(),
  bodyWrapper('userPassword', 'Enter your password.')
    .notEmpty()
    .trim()
];

const validateRegister = (bodyWrapper) => [
  bodyWrapper('userEmail')
    .isEmail()
    .withMessage('Enter a valid email address.')
    .notEmpty()
    .withMessage('Enter your email address.')
    .normalizeEmail(),
  bodyWrapper('fullName', 'Enter your full name.')
    .notEmpty()
    .trim(),
  bodyWrapper('userPassword', 'Password must be at least 5 characters in length.')
    .isLength({ min: 5 })
    .trim()
];

const router = new express.Router();

router.get('/login', authController.getLoginPage);

router.get('/register', authController.getRegisterPage);

router.post('/login', validateLogin(body), authController.loginUser);

router.post('/logout', authController.logoutUser);

router.post('/register', validateRegister(body), authController.postCreateUser);

module.exports = router;
