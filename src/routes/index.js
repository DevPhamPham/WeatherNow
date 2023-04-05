const homeRoute = require("./home.route");
const authRoute = require("./auth.route");
const apiRoute = require("./API.route");

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth");
  }
  return next();
};

const router = (app) => {

  app.use("/api",isAuthenticated, apiRoute);
  app.use(/^\/(home)?$/, isAuthenticated, homeRoute);
  app.use("/auth", authRoute);

};

module.exports = router;
