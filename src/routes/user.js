const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/auth');
const userController = require('../controllers/user');

const router = new express.Router();

const validateAddCart = (bodyWrapper) => [
  bodyWrapper('productId', 'ProductId is missing.')
    .isString()
    .notEmpty()
    .trim(),
  bodyWrapper('quantity', 'Quantity missing.')
    .notEmpty()
    .trim()
];

const validateremoveCart = (bodyWrapper) => [
  bodyWrapper('productId', 'ProductId is missing.')
    .isString()
    .notEmpty()
    .trim()
];

router.get('/checkout', userController.getCheckout);

router.get('/cart', isAuth, userController.getCart);

router.post('/cart', isAuth, validateAddCart(body), userController.addToCart);

router.post('/remove-cart-product', isAuth, validateremoveCart(body), userController.removeCartProduct);

module.exports = router;
