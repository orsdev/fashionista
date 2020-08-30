const OrderClass = require('../model/order');
const { validationResult } = require('express-validator');
const flashError = require('../utils/flashError');

exports.getOrder = (req, res, next) => {
  OrderClass.getAllOrders(req, res)
    .then((response) => {
      const orders = response.length && response[0].products;
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
  };

  const { productId } = req.body;
  const findIndex = req.user.cart.items.findIndex((prod) => prod.productId.toString() === productId.toString());

  try {

    const userCart = await req.user.populate('cart.items.productId').execPopulate();
    const cartOrder = {
      products: [
        {
          product: { ...userCart.cart.items[findIndex].productId._doc },
          quantity: userCart.cart.items[findIndex].quantity
        }
      ],
      user: {
        userName: req.user.fullName,
        userId: req.user._id
      }
    };

    if (userCart) {
      OrderClass.addToOrders(req, res, cartOrder, async (order) => {

        try {
          const userOrder = await order.save();

          req.user.removeFromOrderCart(productId)
            .then(() => res.redirect('/order'))
            .catch(() => {
              OrderClass.removeOrder(req, res, userOrder._id);
              const errMessage = 'Failed to order product. We are currently working on this problem';
              return flashError(req, res, errMessage, '/cart');
            });
        } catch (e) {
          const errMessage = 'Failed to order product. We are currently working on this problem';
          return flashError(req, res, errMessage, '/cart');
        }
      });
    }

  } catch (e) {
    return res.redirect('/order');
  }
};
