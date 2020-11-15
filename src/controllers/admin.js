const { validationResult } = require('express-validator');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { ProductClass, ProductsSchema } = require('../model/product');
const flashError = require('../utils/flashError');
const flashMessage = require('../utils/flashMessage');
const flashBodyError = require('../utils/flashBodyError');
const {
  capitalizeFirstLetters,
  capitalizeFirstLetter
} = require('../utils/lodashHelper');
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

  const showPerPage = 10;
  let skippedPage = 0;
  let page = 0;

  if (req.query.page) {
    const getPageNumber = Number(req.query.page);
    page = getPageNumber;
    skippedPage = (getPageNumber - 1) * showPerPage;
  }

  try {
    const allProducts = await ProductClass.getAllProducts(
      req,
      res,
      skippedPage,
      showPerPage
    );
    const productsLength = await ProductClass.getAllProducts(
      req,
      res,
      null,
      null
    );
    const products = !allProducts.length ? [] : allProducts;

    let paginationLength = Math.floor(
      productsLength.length / showPerPage
    );

    if (productsLength.length % showPerPage !== 0) {
      paginationLength += 1;
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

exports.postAddProduct = async (req, res, next) => {
  const {
    title, tag, feature, price, description
  } = req.body;
  const productImage = req.file;

  // check if file is an image
  if (req.invalidFormat) {
    return res.status(422).render('admin/add-product', {
      errorMessage: 'Select an image format.',
      oldInput: {
        title,
        tag,
        feature,
        price,
        description
      }
    });
  }

  // check if image exist
  if (!productImage) {
    return res.status(422).render('admin/add-product', {
      errorMessage: 'Select product image',
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
        title,
        tag,
        feature,
        price,
        description
      }
    });
  }

  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(productImage.path));

    const request = await fetch('https://api.imgur.com/3/image', {
      method: 'post',
      headers: {
        Authorization: process.env.IMGUR_CLIENT_ID
      },
      body: formData
    });

    const imgResponse = await request.json();

    const capitalizeTitle = capitalizeFirstLetters(title);
    const capitalizeTag = capitalizeFirstLetters(tag);
    const capitalizeDescription = capitalizeFirstLetter(description);

    const newBody = {
      ...req.body,
      price: Number(price),
      title: capitalizeTitle,
      tag: capitalizeTag,
      productImage: imgResponse.data.link,
      description: capitalizeDescription,
      userId: req.user._id
    };

    try {
      const product = await new ProductsSchema(newBody);
      // Delete product image
      if (fs.existsSync(productImage.path)) {
        deleteFile(next, productImage.path, (err) => {
          if (err) {
            return next(err);
          }

          console.log('file deleted');
        });
      }
      await product.save();
      const message = 'Product upload successfull';
      return flashMessage(req, res, message, '/admin/add-product');
    } catch (e) {
      // Delete product image
      if (fs.existsSync(productImage.path)) {
        deleteFile(next, productImage.path, (err) => {
          if (err) {
            return next(err);
          }

          console.log('file deleted');
        });
      }

      throw Error();
    }
  } catch (e) {
    // Delete product image
    if (fs.existsSync(productImage.path)) {
      deleteFile(next, productImage.path, (err) => {
        if (err) {
          return next(err);
        }

        console.log('file deleted');
      });
    }
    const errMessage = 'Product upload failed. Please try again!';
    return flashError(req, res, errMessage, '/admin/add-product');
  }
};

exports.postUpdateProduct = async (req, res, next) => {
  const {
    productId,
    title,
    price,
    tag,
    description,
    feature
  } = req.body;

  let imgResponse = null;

  // check if file is an image
  if (req.invalidFormat) {
    res.status(422);
    return flashError(
      req,
      res,
      'Select an image format',
      `/admin/edit-product/${productId}`
    );
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return flashBodyError(
      req,
      res,
      errors.array(),
      `/admin/edit-product/${productId}`
    );
  }

  if (req.file) {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(req.file.path));

      const request = await fetch('https://api.imgur.com/3/image', {
        method: 'post',
        headers: {
          Authorization: process.env.IMGUR_CLIENT_ID
        },
        body: formData
      });

      imgResponse = await request.json();

      // Delete product image
      if (fs.existsSync(req.file.path)) {
        deleteFile(next, req.file.path, (err) => {
          if (err) {
            return next(err);
          }

          console.log('file deleted');
        });
      }
    } catch (e) {
      // Delete product image
      if (fs.existsSync(req.file.path)) {
        deleteFile(next, req.file.path, (err) => {
          if (err) {
            return next(err);
          }

          console.log('file deleted');
        });
      }

      const errMessage = 'Product update failed. Please try again!';
      return flashError(
        req,
        res,
        errMessage,
        `/admin/edit-product/${productId}`
      );
    }
  }

  try {
    const product = await ProductClass.postUpdateProduct(req, res);

    const capitalizeTitle = capitalizeFirstLetters(title);
    const capitalizeTag = capitalizeFirstLetters(tag);
    const capitalizeDescription = capitalizeFirstLetter(description);

    product.title = capitalizeTitle;
    product.price = price;
    product.tag = capitalizeTag;
    product.description = capitalizeDescription;
    product.feature = feature;

    if (imgResponse) {
      product.productImage = imgResponse.data.link;
    }

    await product.save();
    return flashMessage(
      req,
      res,
      'Product updated successfully',
      `/admin/edit-product/${productId}`
    );
  } catch (e) {
    const errMessage = 'Product update failed. Please try again!';
    return flashError(
      req,
      res,
      errMessage,
      `/admin/edit-product/${productId}`
    );
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
      const message = `${response.title} Deleted.`;
      return flashMessage(req, res, message, '/admin/home');
    })
    .catch((error) => {
      const errMessage = 'Unable to delete product. Please try again!';
      return flashError(req, res, errMessage, '/admin/home');
    });
};
