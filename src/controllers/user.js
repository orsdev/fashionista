const { validationResult } = require('express-validator');
const { UserClass } = require('../model/user');

exports.getCart = (req, res, next) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  UserClass.getCartItems(req, res)
    .populate('cart.items.productId')
    .execPopulate()
    .then((response) => {
      const cart = (response.cart.items.length && response.cart.items);
      return res.render('shop/cart', {
        pageTitle: 'FASHIONIT | CART',
        path: '/cart',
        cart,
        errorMessage
      });

    })
    .catch(() => {
      const error = new Error('Unable to get cart product(s).');
      return next(error);
    });
};

exports.getCheckout = (req, res) => res.render('shop/checkout', {
  pageTitle: 'FASHIONIT | CHECKOUT',
});

exports.addToCart = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Missing params in cart');
    return next(error);
  }
  UserClass.addToCart(req, res, next);
};

exports.removeCartProduct = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Missing params in cart');
    return next(error);
  }
  UserClass.removeCartProduct(req, res, next);
};
