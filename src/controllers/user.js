const { UserClass } = require('../model/user');

exports.getCart = (req, res) => {
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
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res) => res.render('shop/checkout', {
  pageTitle: 'FASHIONIT | CHECKOUT',
});

exports.addToCart = (req, res) => {
  UserClass.addToCart(req, res);
};

exports.removeCartProduct = (req, res) => {
  UserClass.removeCartProduct(req, res);
};
