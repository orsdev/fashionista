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
      products,
    });

  } catch (e) {
    const error = new Error('Unable to fetch homepage products.');
    return next(error);
  }
};

exports.getShop = async (req, res, next) => {
  const showPerPage = 10;
  let skippedPage = 0;
  let page = 0;

  if (req.query.page) {
    const getPageNumber = Number(req.query.page);
    page = getPageNumber;
    skippedPage = ((getPageNumber - 1) * showPerPage);
  }

  try {
    const allProducts = await ProductClass.getAllProducts(req, res, skippedPage, showPerPage);
    const productsLength = await ProductClass.getAllProducts(req, res, null, null);
    const products = (!allProducts.length) ? [] : allProducts;

    let paginationLength = Math.floor(productsLength.length / showPerPage);

    if ((productsLength.length % showPerPage) !== 0) {
      paginationLength += 1;
    }

    page = page === 0 ? 1 : page;

    return res.render('shop/shop', {
      pageTitle: 'FASHIONIT | SHOP',
      path: '/shop',
      page,
      paginationLength,
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
    }

    return res.render('shop/details', {
      product
    });

  } catch (e) {
    const error = new Error('Unable to get product details page.');
    return next(error);
  }
};
