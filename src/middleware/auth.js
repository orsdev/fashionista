const { User } = require('../model/user');

module.exports = (req, res, next) => {
  if (!(req.session.isAuthenticated && req.session.user)) {
    return res.redirect('/login');
  } else {
    const user = User.findById(req.session.user._id);
    user.then((response) => {
      req.user = response;
      next();
    }).catch(() => {
      return res.redirect('/login');
    });
  }
};