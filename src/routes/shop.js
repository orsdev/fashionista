const express = require('express');
const isAuth = require('../middleware/auth');
const productController = require('../controllers/product');

const router = new express.Router();

router.get('/', productController.getHomePage);

router.get('/home', productController.getHomePage);

router.get('/shop', productController.getShop);

router.get('/shop/:productId', isAuth, productController.getSingleProduct);

module.exports = router;
