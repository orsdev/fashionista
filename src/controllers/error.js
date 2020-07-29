exports.getErrorPage = async (req, res) => {
  res.render('404', { pageTitle: 'FASHIONIT | PAGE NOT FOUND' });
};
