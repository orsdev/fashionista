const express = require('express');
const bodyParser = require('body-parser');
const router = new express.Router();
const adminController = require('../controllers/admin');

const jsonParser = bodyParser.json();

router.get('/products', adminController.getAllProducts);

router.get('/add-product', adminController.getAddProductPage);

router.post('/add-product', jsonParser, adminController.postAddProduct);

router.patch('/edit-product/:productId', jsonParser, adminController.patchUpdateProduct);

router.delete('/:productId', adminController.deleteProduct);

module.exports = router;
