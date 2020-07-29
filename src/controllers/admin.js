exports.getAllProducts = async (req, res) => {
  res.send('get all products page');
};

exports.getAddProductPage = async (req, res) => {
  res.render('admin/add-product', { pageTitle: 'FASHIONIT | ADD PRODUCT' });
};

exports.postAddProduct = async (req, res) => {
  res.send('admin/add-product');
};
