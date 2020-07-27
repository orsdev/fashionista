const express = require('express');
const router = new express.Router();
const productController = require('../controllers/products');

router.get('/shop', productController.getAllProducts);

module.exports = router;