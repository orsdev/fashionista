exports.getAllProducts = async (req, res) => {
  res.send('get all products page');
};

exports.getAddProductPage = async (req, res) => {
  res.render('add-product', { pageTitle: 'FASHIONIT | ADD PRODUCT' });
};

exports.postAddProduct = async (req, res) => {
  res.send('add-product');
};
