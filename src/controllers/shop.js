exports.getHomePage = async (req, res) => {
  res.render('home', { pageTitle: 'FASHIONIT | HOME' });
};

exports.getAllProducts = async (req, res) => {
  res.render('shop/shop', { pageTitle: 'FASHIONIT | SHOP' });
};

exports.getCart = async (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'FASHIONIT | CART'
  });
};

exports.getOrders = async (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'FASHIONIT | YOUR ORDERS'
  });
};

exports.getCheckout = async (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'FASHIONIT | CHECKOUT'
  });
};
