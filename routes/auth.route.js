var express = require('express');
var controller = require('../controllers/auth.controller');

var router = express.Router();

// https://expressjs.com/en/starter/basic-routing.html
router.get("/login", controller.login);

router.post("/login", controller.postLogin);

router.get("/logout", controller.logout);

module.exports = router;