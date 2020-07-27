const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = new express.Router();
const productsController = require('../controllers/products');

const jsonParser = bodyParser.json();

adminRouter.get('/products', productsController.getAllProducts);

adminRouter.get('/add-product', productsController.getAddProductPage);

adminRouter.post('/add-product', jsonParser, productsController.postAddProduct);

module.exports = adminRouter;
