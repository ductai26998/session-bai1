var express = require('express');
var multer = require('multer');

var controller = require('../controllers/book.controller');
var authMiddleware = require('../middlewares/auth.middleware');

var router = express.Router();
var upload = multer({dest: './public/updates/'});


// https://expressjs.com/en/starter/basic-routing.html
router.get("/", controller.get);

router.get('/search', controller.search);

router.get('/create', authMiddleware.requireAuth, controller.create);

router.post('/create', authMiddleware.requireAuth, 
	upload.single('cover'),
	controller.postCreate);

router.get("/:id/delete", authMiddleware.requireAuth, controller.delete);

router.get('/:id/update', authMiddleware.requireAuth, controller.update);

router.post('/:id/update', authMiddleware.requireAuth, controller.postUpdate);


module.exports = router;
