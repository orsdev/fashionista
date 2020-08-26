const flashMessage = (req, res, error, route) => {
  req.flash('message', error);
  return req.session.save((err) => {
    if (err) {
      console.log('Something went wrong-', err);
    }
    return res.redirect(route);
  });
};

module.exports = flashMessage;
