const { OrderClass } = require('../model/order');

exports.getOrders = (req, res) => {

  OrderClass.addToOrders(req, (order) => {
    order.save()
      .then((response) => {

      })
      .catch((err) => {

      });
  });

  res.render('shop/orders', {
    pageTitle: 'FASHIONIT | YOUR ORDERS',
    path: '/orders'
  });
};
