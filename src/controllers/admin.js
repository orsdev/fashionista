const { ProductClass } = require('../model/product');

exports.getAllProducts = async (req, res) => {
  res.send('get all products page');
};

exports.getAddProductPage = async (req, res) => {
  res.render('admin/add-product', { pageTitle: 'FASHIONIT | ADD PRODUCT' });
};

exports.postAddProduct = async (req, res) => {
  const product = ProductClass.postProduct(req, res);

  product.save()
    .then((response) => res.send({ message: 'Product upload successfull' }))
    .catch((e) => res.status(400).send({ error: e.message }));
};

exports.patchUpdateProduct = (req, res) => {
  ProductClass.patchUpdateProduct(req, res);
};

exports.deleteProduct = (req, res) => {
  ProductClass.deleteProduct(req, res);
};
