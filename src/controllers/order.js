const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { OrderClass } = require('../model/order');
const flashError = require('../utils/flashError');

exports.getOrder = (req, res, next) => {

  // Get Failed product upload message
  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }

  const orders = req.order.order.length && req.order.order;
  let totalPrice = 0;
  if (orders) {
    for (const key of orders) {
      totalPrice += (key.product.price * key.quantity);
    }
  }

  return res.render('shop/orders', {
    pageTitle: 'FASHIONIT | YOUR ORDERS',
    path: '/order',
    orders,
    totalPrice,
    errorMessage: error
  });
};

exports.postOrder = async (req, res) => {

  try {
    const order = await OrderClass.addToOrders(req);
    req.user.removeAllCartItems()
      .then(() => res.redirect('/order'))
      .catch(() => {
        const errMessage = 'Failed to order product. We are currently working on this problem';
        return flashError(req, res, errMessage, '/cart');
      });
  } catch (e) {
    const errMessage = 'Failed to order product. We are currently working on this problem';
    return flashError(req, res, errMessage, '/cart');
  }
};

exports.deleteOrder = (req, res) => {
  OrderClass.deleteOrders(req, res)
    .then((response) => res.redirect('/order'))
    .catch((error) => {
      const errMessage = 'Unable to cancel order. Please try again.';
      return flashError(req, res, errMessage, '/order');
    });
};

exports.createPayment = async (req, res) => {

  const orders = req.order.order.length && req.order.order;
  let totalPrice = 0;
  if (orders) {
    for (const key of orders) {
      totalPrice += (key.product.price * key.quantity);
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: 'usd'
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
};
