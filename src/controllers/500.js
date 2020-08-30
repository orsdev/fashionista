exports.get500Page = async (error, req, res, next) => {
  res.status(500);
  res.render('500', {
    pageTitle: 'FASHIONIT | SERVER ERROR',
    errorMessage: error
  });
};
