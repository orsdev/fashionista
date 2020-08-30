const { UserClass } = require('../model/user');

exports.getCart = (req, res, next) => {
  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
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
        errorMessage: error
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
  UserClass.addToCart(req, res, next);
};

exports.removeCartProduct = (req, res, next) => {
  UserClass.removeCartProduct(req, res, next);
};
