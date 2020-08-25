const express = require('express');
const isAuth = require('../middleware/auth');
const orderController = require('../controllers/order');

const router = new express.Router();

router.get('/orders', isAuth, orderController.getOrders);

module.exports = router;