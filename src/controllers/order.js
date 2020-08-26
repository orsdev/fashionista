const { OrderClass } = require('../model/order');
const flashError = require('../utils/flashError');

exports.getOrder = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'FASHIONIT | YOUR ORDERS',
    path: '/orders'
  });
};

exports.postOrder = async (req, res) => {
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

        let userOrder = null;
        try {
          userOrder = await order.save();
          req.user.removeFromOrderCart(productId)
            .then(() => res.redirect('/order'))
            .catch(() => {
              OrderClass.removeOrder(req, res, userOrder._id);
              const errMessage = 'Failed to order product. We are currently working on this problem';
              flashError(req, res, errMessage, '/cart');
            });
        } catch (e) {
          OrderClass.removeOrder(req, res, userOrder._id);
          const errMessage = 'Failed to order product. We are currently working on this problem';
          flashError(req, res, errMessage, '/cart');
        }
      });
    }

  } catch (e) {
    return res.redirect('/order');
  }
};
