var express = require('express');
var controller = require('../controllers/cart.controller');

var router = express.Router();

router.get('/:id', controller.get);

router.get('/:id/borrow', controller.borrow)

router.get('/:id/add', controller.addToCart);

module.exports = router;