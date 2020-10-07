const { validationResult } = require('express-validator');
const { UserClass } = require('../model/user');
const flashMessage = require('../utils/flashMessage');
const flashError = require('../utils/flashError');
const sendWelcomeMessage = require('../mail/welcomeMessage');

exports.getLoginPage = (req, res) => {

  if ((req.session.isAuthenticated && req.session.user)) {
    return res.redirect('/home');
  }

  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }

  return res.render('auth/login', {
    pageTitle: 'FASHIONIT | LOGIN',
    errorMessage: error
  });
};

exports.getRegisterPage = (req, res) => {

  if ((req.session.isAuthenticated && req.session.user)) {
    return res.redirect('/home');
  }

  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }

  let message = req.flash('message');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  return res.render('auth/register', {
    pageTitle: 'FASHIONIT | REGISTER',
    errorMessage: error,
    successMessage: message
  });
};

exports.postCreateUser = async (req, res) => {
  const { fullName, userAddress, userEmail, userPassword } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/register', {
      validationError: errors.array(),
      oldInput: { fullName, userAddress, userEmail, userPassword }
    });
  }

  UserClass.postAddUser(req, res, (user) => {

    user.save()
      .then((response) => {
        const message = 'Your account has been created successfully.';
        sendWelcomeMessage(response.userEmail, response.fullName);
        return flashMessage(req, res, message, '/register');
      }).catch(() => {
        const errMessage = 'Registration failed. Please try again later.';
        return flashError(req, res, errMessage, '/register');
      });
  });
};

exports.loginUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/login', {
      validationError: errors.array(),
      oldInput: { userEmail, userPassword }
    });
  }

  await UserClass.getUserCredentials(req, res, userEmail, userPassword);
};

exports.logoutUser = (req, res) => req.session.destroy((err) => {
  if (err) {
    console.log(`Something went wrong-- ${err}`);
  }

  return res.redirect('/home');
});
