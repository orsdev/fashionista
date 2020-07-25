const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = new express.Router();

const jsonParser = bodyParser.json();

adminRouter.get('/products', async (req, res) => {
  res.send('admin product page')
});

adminRouter.post('/add-products', jsonParser, async (req, res) => {
  res.send('admin add-product')
});

module.exports = adminRouter;
