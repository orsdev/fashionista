const express = require('express');
const isAuth = require('../middleware/auth');
const orderController = require('../controllers/order');

const router = new express.Router();

router.get('/order', isAuth, orderController.getOrder);

router.post('/order', isAuth, orderController.postOrder);

router.post('/create-payment', isAuth, orderController.createPayment);

router.post('/cancel-order', isAuth, orderController.cancelMyOrder);

module.exports = router;
