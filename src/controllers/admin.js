const { validationResult } = require('express-validator');
const { ProductClass, ProductsSchema } = require('../model/product');
const flashError = require('../utils/flashError');
const flashMessage = require('../utils/flashMessage');
const flashBodyError = require('../utils/flashBodyError');
const { capitalizeFirstLetters, capitalizeFirstLetter } = require('../utils/lodashHelper');
const deleteFile = require('../utils/deleteFile');

exports.getAdminHome = async (req, res, next) => {

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

  let showPerPage = 10;
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
      paginationLength = paginationLength + 1;
    }

    page = page === 0 ? 1 : page;

    res.render('admin/home', {
      path: '/admin/home',
      pageTitle: 'FASHIONIT | ADMIN HOME',
      page,
      paginationLength,
      products,
      errorMessage: error,
      successMessage: message
    });

  } catch (e) {
    const err = new Error('Failed to get products.');
    return next(err);
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
  const productImage = req.file;

  if (!productImage) {
    return res.status(422).render('admin/add-product', {
      errorMessage: 'Attached file is not an image',
      oldInput: {
        title,
        tag,
        feature,
        price,
        description
      }
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      validationError: errors.array(),
      oldInput: {
        title, tag, feature, price, description
      }
    });
  }

  const capitalizeTitle = capitalizeFirstLetters(title);
  const capitalizeTag = capitalizeFirstLetters(tag);
  const capitalizeDescription = capitalizeFirstLetter(description);

  const newBody = {
    ...req.body,
    price: Number(price),
    title: capitalizeTitle,
    tag: capitalizeTag,
    productImage: productImage.path,
    description: capitalizeDescription,
    userId: req.user._id
  };

  const product = new ProductsSchema(newBody);
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
    productId, title, price, tag, description, feature
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
        response.feature = feature;

        if (req.file) {
          const oldImagePath = response.productImage;
          // Delete old product image
          deleteFile(next, oldImagePath, (err) => {
            if (err) {
              return next(err);
            }
          });

          response.productImage = req.file.path;
        }

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

exports.deleteProduct = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMessage = 'Product id is missing!';
    return flashError(req, res, errMessage, '/admin/home');
  }

  ProductClass.deleteProduct(req, res)
    .then((response) => {
      // Delete product image
      deleteFile(next, response.productImage, (err) => {
        if (err) {
          return next(err);
        }

        const message = `${response.title} Deleted.`;
        return flashMessage(req, res, message, '/admin/home');

      });

    }).catch((error) => {
      const errMessage = 'Unable to delete product. Please try again!';
      return flashError(req, res, errMessage, '/admin/home');
    });
};
