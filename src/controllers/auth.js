const { UserClass } = require('../model/user');

exports.getLoginPage = (req, res) => {

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
  UserClass.postAddUser(req, res, (user) => {

    user.save()
      .then(() => {
        req.flash('message', 'Your account has been created successfully.');
        req.session.save((err) => {
          if (err) {
            console.log(`Session cannot be saved!- ${err}`);
          }
          return res.redirect('/register');
        });
      }).catch(() => {

        req.flash('error', 'Registration failed. Please try again later');
        req.session.save((err) => {
          if (err) {
            console.log(`Session cannot be saved!- ${err}`);
          }
          return res.redirect('/register');
        });
      });

  });
};

exports.loginUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  await UserClass.getUserCredentials(req, res, userEmail, userPassword);
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(`Something went wrong-- ${err}`);
    }

    return res.redirect('/home');
  });
};
