const { OrderClass } = require('../model/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const flashMessage = require('../utils/flashMessage');
const flashError = require('../utils/flashError');

exports.getOrder = (req, res, next) => {

  // Get Failed product upload message
  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }

  OrderClass.getAllOrders(req, res)
    .then((response) => {
      const orders = response.length && response[0].order;

      let totalPrice = 0;
      if (orders.length) {
        for (let key of orders) {
          totalPrice += (key.product.price * key.quantity)
        }
      }

      return res.render('shop/orders', {
        pageTitle: 'FASHIONIT | YOUR ORDERS',
        path: '/order',
        orders,
        totalPrice,
        errorMessage: error
      });
    }).catch(() => {
      const error = new Error('Failed to get orders.');
      return next(error);
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

exports.cancelMyOrder = (req, res) => {
  OrderClass.cancelOrders(req, res)
    .then((response) => {
      return res.redirect('/order')
    })
    .catch((error) => {
      const errMessage = 'Unable to cancelled order. Please try again.';
      return flashError(req, res, errMessage, '/order');
    })
}

exports.createPayment = async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: "usd"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  })
}