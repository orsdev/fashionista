const express = require('express');
const router = new express.Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.getHomePage);

router.get('/home', shopController.getHomePage);

router.get('/login', shopController.getLoginPage);

router.get('/register', shopController.getRegisterPage);

router.get('/shop', shopController.getAllProducts);

router.get('/shop/checkout', shopController.getCheckout);

router.get('/shop/cart', shopController.getCart);

router.get('/shop/orders', shopController.getOrders);

module.exports = router;