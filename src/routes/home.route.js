const express = require("express");
const router = express.Router();
const homeController = require("../app/controller/home.controller");

router.get("/", homeController.renderHome);


module.exports = router;