const express = require("express");
const router = express.Router();
const apiController = require("../app/controller/API.controller");

router.get("/weather",apiController.getWeather);
router.get("/cities",apiController.getCities);
module.exports = router;
