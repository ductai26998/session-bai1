var db = require('../db');

module.exports.requireAuth = (request, response, next) => {
	var user = db.get('users').find({id: request.signedCookies.userId}).value();

	if (!request.signedCookies.userId) {
		response.redirect('auth/login');
		return;
	}


	if (!user) {
  		response.redirect('auth/login', {
  			errors: ['User does not exist!'],
  			values: request.body
  		});
		return;
	}

	if (user.isAdmin !== "true") {
		response.render('error/index');
	}

	response.locals.user = user;

	next();
}

module.exports.setLocalUser = (request, response, next) => {
	var user = db.get('users').find({id: request.signedCookies.userId}).value();

	response.locals.user = user;

	next();
}