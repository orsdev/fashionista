const ProductsClass = require("../model/products");

exports.getAllProducts = async (req, res) => {
  res.send('get all products page');
};

exports.getAddProductPage = async (req, res) => {
  res.render('admin/add-product', { pageTitle: 'FASHIONIT | ADD PRODUCT' });
};

exports.postAddProduct = async (req, res) => {
  const body = req.body;
  products = await ProductsClass.postProduct(req, res, body);
};
