const { Order } = require('../model/order');

const initializeOrder = async (req, res, next) => {
  if (req.session.user && req.session.isAuthenticated) {
    try {
      const userOrder = await Order.find({ 'user.userId': req.session.user._id });
      if (userOrder.length === 0) {

        const cartOrder = {
          order: [],
          user: {
            userName: req.session.user.fullName,
            userId: req.session.user._id
          }
        };

        const productOrder = new Order(cartOrder);
        productOrder.save()
          .then((response) => next()).catch((e) => next(e));
      } else {
        return next();
      }
    } catch (e) {
      return next(e);
    }
  } else {
    return next();
  }
};

module.exports = initializeOrder;
