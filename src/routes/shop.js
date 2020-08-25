const express = require('express');
const productController = require('../controllers/product');

const router = new express.Router();

router.get('/', productController.getHomePage);

router.get('/home', productController.getHomePage);

router.get('/shop', productController.getShop);

router.get('/shop/details/:productId', productController.getProductDetails);

module.exports = router;
