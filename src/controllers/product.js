const { ProductClass } = require('../model/product');

exports.getHomePage = async (req, res) => {
  try {
    const featuredProducts = ProductClass.getFeaturedProducts(req, res, 5);
    const homeProducts = ProductClass.getHomeProducts(req, res, 12);

    const mergedProducts = await Promise.all([featuredProducts, homeProducts]);

    const featured = (!mergedProducts[0].length) ? 'No Featured Products' : mergedProducts[0];
    const products = (!mergedProducts[1].length) ? 'No Products' : mergedProducts[1];

    if (req.path === '/') {
      res.render('home', {
        pageTitle: 'FASHIONIT | HOME',
        loader: true,
        featured,
        products,
      });
    } else {
      res.render('home', {
        pageTitle: 'FASHIONIT | HOME',
        loader: false,
        featured,
        products,
      });
    }
  } catch (e) {
    res.status(400).send({ error: 'Bad Request' });
  }
};

exports.getLoginPage = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'FASHIONIT | LOGIN',
  });
};

exports.getRegisterPage = (req, res) => {
  res.render('auth/register', {
    pageTitle: 'FASHIONIT | REGISTER',
  });
};

exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await ProductClass.getAllProducts(req, res, 20);
    const products = (!allProducts.length) ? 'No Products' : allProducts;

    res.render('shop/shop', {
      pageTitle: 'FASHIONIT | SHOP',
      path: '/shop',
      products,
    });
  } catch (e) {
    return res.status(400).send({ error: 'Bad Request' });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const product = await ProductClass.getSingleProduct(req, res);

    if (!product) {
      return res.status(404).send({ message: 'Product not found.' });
    }

    return res.send(product);
  } catch (e) {
    return res.status(500).send({ error: 'Bad Request.' });
  }
};

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
