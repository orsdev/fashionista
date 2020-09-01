const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/auth');
const adminController = require('../controllers/admin');

const router = new express.Router();

const validateAddProduct = (bodyWrapper) => [
  bodyWrapper('title', 'Enter product title.')
    .notEmpty()
    .trim(),
  bodyWrapper('tag', 'Enter product tag.')
    .notEmpty()
    .trim(),
  bodyWrapper('feature')
    .trim(),
  bodyWrapper('price', 'Enter product price.')
    .notEmpty()
    .trim(),
  bodyWrapper('description')
    .notEmpty()
    .withMessage('Enter product description.')
    .isLength({ min: 50 })
    .withMessage('Product description must be at least 50 characters in length.')
    .trim()
];

router.get('/admin/home', isAuth, adminController.getAdminHome);

router.get('/admin/add-product', isAuth, adminController.getAddProductPage);

router.get('/admin/edit-product/:productId', isAuth, adminController.getEditProductPage);

router.post('/admin/add-product', isAuth, validateAddProduct(body), adminController.postAddProduct);

router.post('/admin/edit-product', isAuth, validateAddProduct(body), adminController.postUpdateProduct);

router.delete('/admin/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;
