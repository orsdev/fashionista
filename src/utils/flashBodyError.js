const flashBodyError = (req, res, error, route) => {
  req.flash('bodyError', JSON.stringify(error));
  return req.session.save((err) => {
    if (err) {
      console.log('Something went wrong-', err);
    }
    return res.redirect(route);
  });
};

module.exports = flashBodyError;
