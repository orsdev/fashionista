const ProductsClass = require("../model/products");

exports.getAllProducts = async (req, res) => {
  res.send('get all products page');
};

exports.getAddProductPage = async (req, res) => {
  res.render('admin/add-product', { pageTitle: 'FASHIONIT | ADD PRODUCT' });
};

exports.postAddProduct = (req, res) => {
  ProductsClass.postProduct(req, res);
};

exports.patchUpdateProduct = (req, res) => {
  ProductsClass.patchUpdateProduct(req, res);
}

exports.deleteProduct = (req, res) => {
  ProductsClass.deleteProduct(req, res);
}