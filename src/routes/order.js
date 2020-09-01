const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/auth');
const orderController = require('../controllers/order');

const router = new express.Router();

const validateOrder = (bodyWrapper) => [
  bodyWrapper('productId', 'ProductId is missing.')
    .isString()
    .notEmpty()
    .trim()
];

router.get('/order', isAuth, orderController.getOrder);

router.post('/order', isAuth, validateOrder(body), orderController.postOrder);

module.exports = router;
