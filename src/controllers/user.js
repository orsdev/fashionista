const { UserClass } = require('../model/user');

exports.getCart = async (req, res) => {

  UserClass.getCartItems(req, res)
    .populate('cart.items.productId')
    .execPopulate()
    .then((response) => {

      const cart = (response.cart.items.length && response.cart.items);

      return res.render('shop/cart', {
        pageTitle: 'FASHIONIT | CART',
        path: '/cart',
        cart
      });

    })
    .catch((err) => console.log(err));
};

exports.getOrders = async (req, res) => res.render('shop/orders', {
  pageTitle: 'FASHIONIT | YOUR ORDERS',
});

exports.getCheckout = async (req, res) => res.render('shop/checkout', {
  pageTitle: 'FASHIONIT | CHECKOUT',
});

exports.addToCart = async (req, res) => {
  UserClass.addToCart(req, res);
};
