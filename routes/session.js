module.exports.home = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("index");
    } else {
      next();
    }
  };