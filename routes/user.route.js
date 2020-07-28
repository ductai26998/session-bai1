var express = require('express');
var multer = require('multer');

var controller = require('../controllers/user.controller');
var validate = require('../validates/user.validate');
var authMiddleware = require('../middlewares/auth.middleware');

var router = express.Router();
var upload = multer({dest: './public/updates/'});

// https://expressjs.com/en/starter/basic-routing.html
router.get("/", controller.get);

router.get('/search', controller.search);

router.get('/create', controller.create);

router.post('/create', 
	upload.single('avatar'), 
	validate.postCreate, 
	controller.postCreate);

router.get("/:id/delete", controller.delete);

router.get("/:id/profile", controller.profile);

router.post('/:id/profile', controller.postProfile);

router.get("/:id/profile/avatar", controller.avatar);

router.post("/:id/profile/avatar", 
	upload.single('avatar'), 
	controller.postAvatar);

module.exports = router;
