const { User } = require('../model/user');

const isAuth = (req, res, next) => {
  if (!(req.session.isAuthenticated && req.session.user)) {
    return res.redirect('/login');
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }
      req.user = user;
      return next();
    }).catch(() => {
      const error = new Error('Unable to save user session.');
      return next(error);
    });

};

module.exports = isAuth;
