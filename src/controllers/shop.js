const ProductsClass = require("../model/products");

exports.getHomePage = async (req, res) => {

  try {
    const featuredProducts = ProductsClass.getFeaturedProducts(req, res, 5);
    const homeProducts = ProductsClass.getHomeProducts(req, res, 12);

    const mergedProducts = await Promise.all([featuredProducts, homeProducts]);

    let featured = (!mergedProducts[0].length) ? 'No Featured Products' : mergedProducts[0];
    let products = (!mergedProducts[1].length) ? 'No Products' : mergedProducts[1];

    if (req.path === "/") {
      res.render('home', {
        pageTitle: 'FASHIONIT | HOME',
        loader: true,
        featured,
        products
      });
    } else {
      res.render('home', {
        pageTitle: 'FASHIONIT | HOME',
        loader: false,
        featured,
        products
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
    const allProducts = await ProductsClass.getAllProducts(req, res, 20);
    let products = (!allProducts.length) ? 'No Products' : allProducts;

    res.render('shop/shop', {
      pageTitle: 'FASHIONIT | SHOP',
      path: 'shop/shop',
      products
    });
  } catch (e) {
    res.status(400).send({ error: 'Bad Request' });
  }
};

exports.getSingleProduct = async (req, res) => {

  try {
    const product = await ProductsClass.getSingleProduct(req, res);
    res.send(product);
  } catch (e) {
    res.status(404).send({ error: 'Product not Found!' })
  }
}

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
