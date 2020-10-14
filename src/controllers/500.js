exports.get500Page = (error, req, res, next) => {
  res.status(500);
  res.render('500', {
    path: req.originalUrl,
    pageTitle: 'FASHIONIT | SERVER ERROR',
    errorMessage: error
  });
};
