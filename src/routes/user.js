const express = require('express');
const isAuth = require('../middleware/auth');
const userController = require('../controllers/user');

const router = new express.Router();

router.get('/checkout', userController.getCheckout);

router.get('/cart', isAuth, userController.getCart);

router.get('/orders', userController.getOrders);

router.post('/cart', isAuth, userController.addToCart);

module.exports = router;
