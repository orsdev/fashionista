const express = require('express');
const isAuth = require('../middleware/auth');
const userController = require('../controllers/user');
const { body } = require('express-validator');

const router = new express.Router();

const validateAddCart = (body) => {
  return [
    body('productId', 'ProductId is missing.')
      .isString()
      .notEmpty()
      .trim(),
    body('quantity', 'Quantity missing.')
      .notEmpty()
      .trim()
  ]
};

const validateremoveCart = (body) => {
  return [
    body('productId', 'ProductId is missing.')
      .isString()
      .notEmpty()
      .trim()
  ]
};

router.get('/checkout', userController.getCheckout);

router.get('/cart', isAuth, userController.getCart);

router.post('/cart', isAuth, validateAddCart(body), userController.addToCart);

router.post('/remove-cart-product', isAuth, validateremoveCart(body), userController.removeCartProduct);

module.exports = router;
