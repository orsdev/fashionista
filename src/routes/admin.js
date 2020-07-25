const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = new express.Router();

const jsonParser = bodyParser.json();

adminRouter.get('/products', async (req, res) => {
  res.send('admin product page')
});

adminRouter.get('/add-product', async (req, res) => {
  res.render('add-product', { pageTitle: 'FASHIONIT | ADD PRODUCT' });
});

adminRouter.post('/add-product', jsonParser, async (req, res) => {
  res.send('add-product');
});

module.exports = adminRouter;
