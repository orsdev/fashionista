exports.get404Page = (req, res) => {
  res.render('404', { pageTitle: 'FASHIONIT | PAGE NOT FOUND' });
};
