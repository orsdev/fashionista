const express = require('express');

const router = new express.Router();
const productController = require('../controllers/product');

router.get('/', productController.getHomePage);

router.get('/home', productController.getHomePage);

router.get('/login', productController.getLoginPage);

router.get('/register', productController.getRegisterPage);

router.get('/shop', productController.getAllProducts);

router.get('/shop/:productId', productController.getSingleProduct);

router.get('/shop/checkout', productController.getCheckout);

router.get('/shop/cart', productController.getCart);

router.get('/shop/orders', productController.getOrders);

module.exports = router;
