const { User } = require('../model/user');

const isAuth = (req, res, next) => {
  if (!(req.session.isAuthenticated && req.session.user)) {
    return res.redirect('/login');
  }
  const user = User.findById(req.session.user._id);
  user.then((response) => {
    req.user = response;
    return next();
  }).catch(() => res.redirect('/login'));

};

module.exports = isAuth;
