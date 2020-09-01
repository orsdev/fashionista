const express = require('express');
const isAuth = require('../middleware/auth');
const adminController = require('../controllers/admin');

const router = new express.Router();

router.get('/admin/home', isAuth, adminController.getAdminHome);

router.get('/admin/edit-product', isAuth, adminController.getEditProductPage);

router.post('/admin/add-product', isAuth, adminController.postAddProduct);

router.patch('/admin/edit-product', isAuth, adminController.patchUpdateProduct);

router.delete('/admin/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;
