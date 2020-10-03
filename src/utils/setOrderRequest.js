const { Order } = require('../model/order');

const setOrderRequest = async (req, res, next) => {
  if (req.session.user && req.session.isAuthenticated) {
    try {
      const userOrder = await Order.find({ 'user.userId': req.session.user._id });
      req.order = userOrder[0];
      return next();
    } catch (e) {
      return next(e);
    }
  } else {
    return next();
  }
}

module.exports = setOrderRequest;