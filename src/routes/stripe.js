const express = require('express');
const isAuth = require('../middleware/auth');
const stripeController = require('../controllers/stripe');

const router = new express.Router();

router.get('/order-success', isAuth, stripeController.getSuccessPage);

router.get('/order-cancel', isAuth, stripeController.getCancelPage);

router.post('/create-checkout-session', isAuth, stripeController.createPayment);

module.exports = router;
