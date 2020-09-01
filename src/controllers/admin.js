const { validationResult } = require('express-validator');
const { ProductClass } = require('../model/product');
const flashError = require('../utils/flashError');
const flashMessage = require('../utils/flashMessage');
const flashBodyError = require('../utils/flashBodyError');

exports.getAdminHome = async (req, res, next) => {
  try {
    const allProducts = await ProductClass.getAllProducts(req, res, 0);
    const products = (!allProducts.length) ? [] : allProducts;

    res.render('admin/home', {
      path: '/admin/home',
      pageTitle: 'FASHIONIT | ADMIN HOME',
      products
    });

  } catch (e) {
    const error = new Error('Failed to get products.');
    return next(error);
  }

};

exports.getAddProductPage = (req, res) => {
  // Failed product upload message
  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }

  // Successful product upload message
  let message = req.flash('message');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('admin/add-product', {
    pageTitle: 'FASHIONIT | ADD PRODUCT',
    path: '/admin/add-product',
    errorMessage: error,
    successMessage: message
  });
};

exports.getEditProductPage = async (req, res, next) => {

  try {

    const product = await ProductClass.getSingleProduct(req, res);

    if (!product) {
      return res.redirect('/404');
    }

    // Get Product update form error messages
    let validationError = req.flash('bodyError');
    if (validationError.length > 0) {
      validationError = JSON.parse(validationError[0]);
    } else {
      validationError = null;
    }

    // Get Failed product upload message
    let error = req.flash('error');
    if (error.length > 0) {
      error = error[0];
    } else {
      error = null;
    }

    // Get Successful product upload message
    let message = req.flash('message');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render('admin/edit-product', {
      pageTitle: 'FASHIONIT | EDIT PRODUCT',
      product,
      errorMessage: error,
      successMessage: message,
      validationError
    });

  } catch (e) {
    const error = new Error('Product editing failed.');
    return next(error);
  }

};

exports.postAddProduct = (req, res) => {

  const {
    title, tag, feature, price, description
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('admin/add-product', {
      validationError: errors.array(),
      oldInput: {
        title, tag, feature, price, description
      }
    });
  }

  const product = ProductClass.postProduct(req, res);

  product.save()
    .then((response) => {
      if (response) {
        const message = 'Product upload successfull';
        return flashMessage(req, res, message, '/admin/add-product');
      }
    })
    .catch((e) => {
      const errMessage = 'Product upload failed. Please try again!';
      return flashError(req, res, errMessage, '/admin/add-product');
    });
};

exports.postUpdateProduct = async (req, res, next) => {

  const {
    productId, title, price, tag, description, productImage, feature
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return flashBodyError(req, res, errors.array(), `/admin/edit-product/${productId}`);
  }

  try {

    ProductClass.postUpdateProduct(req, res)
      .then((response) => {
        response.title = title;
        response.price = price;
        response.tag = tag;
        response.description = description;
        response.productImage = productImage;
        response.feature = feature;

        return response.save();
      })
      .then((result) => {
        if (result) {
          const message = 'Product updated successfully';
          return flashMessage(req, res, message, `/admin/edit-product/${productId}`);
        }
      })
      .catch(() => {
        const errMessage = 'Product update failed. Please try again!';
        return flashError(req, res, errMessage, `/admin/edit-product/${productId}`);
      });

  } catch (e) {
    const error = new Error('Unable to update product.');
    return next(error);
  }

};

exports.deleteProduct = (req, res) => {
  ProductClass.deleteProduct(req, res);
};
