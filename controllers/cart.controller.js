var db = require('../db');
const shortid = require('shortid');

module.exports.get = (request, response, next) => {
	var booksInCart = [];
	var cart = {};
	var userId = request.signedCookies.userId;
	var user = db.get('users').find({id: userId}).value();
	var sessionId = request.signedCookies.sessionId;
	var session = db.get('sessions').find({id: sessionId}).value();
	if (!user) {
		Object.assign(cart, session.cart);
	} else {
		Object.assign(cart, user.cart);
	}

	for (var bookId in cart) {
		booksInCart.push(db.get('books').find({id: bookId}).value());
	}

	response.render("cart/index", {
		books: booksInCart
	});
}

module.exports.borrow = (request, response, next) => {
	var cart = {};
	var userId = request.signedCookies.userId;
	var user = db.get('users').find({id: userId}).value();
	Object.assign(cart, user.cart);

	for (var bookId in cart) {
		request.body.id = shortid.generate();
		request.body.isComplete = "false";
		request.body.userId = request.signedCookies.userId;
		request.body.bookId = bookId;

		db.get('transactions').push(request.body).write();
		// Object.assign(request.body, {});
	}
	user.cart = {};
	response.redirect('/books');
}

module.exports.addToCart = (request, response, next) => {
	var bookId = request.params.id;
	var sessionId = request.signedCookies.sessionId;
	var count = 0;
	if (!db.get('sessions').find({id: sessionId}).get('cart.' + bookId).value()) {
		count = 0;
	}

	if (!sessionId) {
		response.redirect('/books');
	}

	db.get('sessions').find({id: sessionId}).set('cart.' + bookId, count + 1).write();

	response.redirect('/books');
	next();
}