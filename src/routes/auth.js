const express = require('express');
const authController = require('../controllers/auth');
const { body } = require('express-validator');

const validateLogin = (body) => {
  return [
    body('userEmail')
      .isEmail()
      .withMessage('Enter a valid email address.')
      .notEmpty()
      .withMessage('Enter your email address.')
      .normalizeEmail(),
    body('userPassword', 'Enter your password.')
      .notEmpty()
      .trim()
  ]
};

const validateRegister = (body) => {
  return [
    body('userEmail')
      .isEmail()
      .withMessage('Enter a valid email address.')
      .notEmpty()
      .withMessage('Enter your email address.')
      .normalizeEmail(),
    body('fullName', 'Enter your full name.')
      .notEmpty()
      .trim(),
    body('userPassword', 'Password must be at least 5 characters in length & contains only numbers and text.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ]
};

const router = new express.Router();

router.get('/login', authController.getLoginPage);

router.get('/register', authController.getRegisterPage);

router.post('/login', validateLogin(body), authController.loginUser);

router.post('/logout', authController.logoutUser);

router.post('/register', validateRegister(body), authController.postCreateUser);

module.exports = router;
