exports.get404Page = async (req, res) => {
  res.render('404', { pageTitle: 'FASHIONIT | PAGE NOT FOUND' });
};
