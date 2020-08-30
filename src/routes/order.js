const express = require('express');
const isAuth = require('../middleware/auth');
const orderController = require('../controllers/order');
const { body } = require('express-validator');

const validateOrder = (body) => {
  return [
    body('productId', 'ProductId is missing.')
      .isString()
      .notEmpty()
      .trim()
  ]
};


const router = new express.Router();

router.get('/order', isAuth, orderController.getOrder);

router.post('/order', isAuth, validateOrder(body), orderController.postOrder);

module.exports = router;
