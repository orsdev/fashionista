const { validationResult } = require('express-validator');
const { OrderClass } = require('../model/order');
const flashError = require('../utils/flashError');

exports.getOrder = (req, res, next) => {
  OrderClass.getAllOrders(req, res)
    .then((response) => {
      // const orders = response.length && response[0].products;
      const orders = 0;
      console.log(response[0].order);
      return res.render('shop/orders', {
        pageTitle: 'FASHIONIT | YOUR ORDERS',
        path: '/order',
        orders
      });
    }).catch(() => {
      const error = new Error('Failed to get orders.');
      return next(error);
    });
};

exports.postOrder = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Unable to order product.');
    return next(error);
  }

  try {
    const order = await OrderClass.addToOrders(req);
    req.user.removeAllCartItems()
      .then(() => res.redirect('/cart'))
      .catch(() => {
        const errMessage = 'Failed to order product. We are currently working on this problem';
        return flashError(req, res, errMessage, '/cart');
      });
  } catch (e) {
    const errMessage = 'Failed to order product. We are currently working on this problem';
    return flashError(req, res, errMessage, '/cart');
  }
};
