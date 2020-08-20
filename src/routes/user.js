const express = require('express');
const isAuth = require('../middleware/auth');
const userController = require('../controllers/user');

const router = new express.Router();

router.get('/checkout', isAuth, userController.getCheckout);

router.get('/cart', isAuth, userController.getCart);

router.get('/orders', isAuth, userController.getOrders);

module.exports = router;
