const express = require('express');
const bodyParser = require('body-parser');
const router = new express.Router();
const adminController = require('../controllers/admin');

const jsonParser = bodyParser.json();

router.get('/products', adminController.getAllProducts);

router.get('/add-product', adminController.getAddProductPage);

router.post('/add-product', jsonParser, adminController.postAddProduct);

module.exports = router;
