const express = require('express');
const isAuth = require('../middleware/auth');
const adminController = require('../controllers/admin');

const router = new express.Router();

router.get('/products', isAuth, adminController.getAllProducts);

router.get('/add-product', isAuth, adminController.getAddProductPage);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.patch('/edit-product/:productId', isAuth, adminController.patchUpdateProduct);

router.delete('/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
