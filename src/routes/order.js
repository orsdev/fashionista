const express = require('express');
const isAuth = require('../middleware/auth');
const orderController = require('../controllers/order');

const router = new express.Router();

router.get('/order', isAuth, orderController.getOrder);

router.post('/order', isAuth, orderController.postOrder);

module.exports = router;
