const shortid = require('shortid');

var db = require('../db');

module.exports = (request, response, next) => {
	var sessionId = request.signedCookies.sessionId;
	var session = db.get('sessions').find({id: sessionId}).value();
	var user = db.get('users').find({id: request.signedCookies.userId}).value();

	if (!request.signedCookies.sessionId) {
		var sessionId = shortid.generate();
		response.cookie("sessionId", sessionId, {
	    signed: true
	  });

	  db.get("sessions").push({
	  	id: sessionId
	  }).write();
	}
	if (user && user.isAdmin !== "true") {
		response.locals.cartId = user.id;
		response.locals.numberBookInCart = Object.keys(user.cart).length;
	} else if (session.cart) {
		response.locals.cartId = session.id;
		response.locals.numberBookInCart = Object.keys(session.cart).length;
	}

	next();
}