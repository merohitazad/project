const user = require("../models/user");

exports.pageNotFound = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "404 - Page Not Found",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user || {},
  });
};
