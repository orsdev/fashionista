const { ProductClass } = require('../model/product');

exports.getHomePage = async (req, res, next) => {
  try {
    const featuredProducts = ProductClass.getFeaturedProducts(req, res, 5);
    const homeProducts = ProductClass.getHomeProducts(req, res, 12);

    const mergedProducts = await Promise.all([featuredProducts, homeProducts]);

    const featured = (!mergedProducts[0].length) ? [] : mergedProducts[0];
    const products = (!mergedProducts[1].length) ? [] : mergedProducts[1];

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
    const error = new Error('Unable to fetch homepage products.');
    return next(error);
  }
};

exports.getShop = async (req, res, next) => {
  try {
    const allProducts = await ProductClass.getAllProducts(req, res, 20);
    const products = (!allProducts.length) ? [] : allProducts;

    return res.render('shop/shop', {
      pageTitle: 'FASHIONIT | SHOP',
      path: '/shop',
      products,
    });
  } catch (e) {
    const error = new Error('Failed to get products.');
    return next(error);
  }
};

exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await ProductClass.getSingleProduct(req, res);

    if (!product) {
      return res.redirect('/404');
    };

    return res.render('shop/details', {
      product
    });

  } catch (e) {
    const error = new Error('Unable to get product details page.');
    return next(error);
  }
};
