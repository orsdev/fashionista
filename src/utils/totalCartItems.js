const { User } = require('../model/user');

const totalCartItems = (req, res, next) => {
  if (!(req.session.user && req.session.isAuthenticated)) {
    res.locals.cartLength = 0;
    return next();
  }

  User.findById(req.session.user._id)
    .then((response) => {
      res.locals.cartLength = response.cart.items.length;
      return next();
    }).catch((error) => {
      next(error);
    });
};

module.exports = totalCartItems;
