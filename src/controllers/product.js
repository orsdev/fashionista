const { ProductClass } = require('../model/product');

exports.getHomePage = async (req, res) => {
  try {
    const featuredProducts = ProductClass.getFeaturedProducts(req, res, 5);
    const homeProducts = ProductClass.getHomeProducts(req, res, 12);

    const mergedProducts = await Promise.all([featuredProducts, homeProducts]);

    const featured = (!mergedProducts[0].length) ? 'No Featured Products' : mergedProducts[0];
    const products = (!mergedProducts[1].length) ? 'No Products' : mergedProducts[1];

    if (req.path === '/') {
      return res.render('home', {
        pageTitle: 'FASHIONIT | HOME',
        loader: true,
        featured,
        products,
      });
    }

    return res.render('home', {
      pageTitle: 'FASHIONIT | HOME',
      loader: false,
      featured,
      products
    });

  } catch (e) {
    return res.status(400).send({ error: 'Bad Request' });
  }
};

exports.getShop = async (req, res) => {
  try {
    const allProducts = await ProductClass.getAllProducts(req, res, 20);
    const products = (!allProducts.length) ? 'No Products' : allProducts;

    return res.render('shop/shop', {
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
      return res.status(404).send({
        message: 'Product not found.'
      });
    }

    return res.send(product);
  } catch (e) {
    return res.status(500).send({ error: 'Bad Request.' });
  }
};
