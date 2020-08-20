exports.getCart = async (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'FASHIONIT | CART',
  });
};

exports.getOrders = async (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'FASHIONIT | YOUR ORDERS',
  });
};

exports.getCheckout = async (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'FASHIONIT | CHECKOUT',
  });
};
