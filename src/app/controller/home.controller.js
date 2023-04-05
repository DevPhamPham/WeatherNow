class HomeController {
    renderHome(req, res) {
      res.render("home");
    }
  }
  
  module.exports = new HomeController();
  