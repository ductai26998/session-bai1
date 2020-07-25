var bcrypt = require('bcrypt');
var db = require('../db');
const sgMail = require('@sendgrid/mail');

module.exports.login = (request, response) => {
	response.render('auth/login');
};

module.exports.postLogin = async (request, response) => {
	var email = request.body.email;
	var password = request.body.password;
  var user = db.get('users').find({email: email}).value();

  if (!user) {
  	response.render('auth/login', {
  		errors: function() {
        return ['User does not exist!'];
      },
  		values: request.body
  	});
  	return;
  }

  const match = await bcrypt.compare(password, user.password);
  console.log(match);

  if (!match) {
    user.wrongLoginCount++;
    if (user.wrongLoginCount >= 4) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: 'vababinhnd1@gmail.com',
        from: 'ductai26998@gmail.com',
        subject: 'Bookmanagement Warning',
        text: 'Your account have been login fail a lot of times on bookmanagement.app !',
        html: '<strong>Your account have been login fail a lot of times on bookmanagement.app !</strong>',
      };
      sgMail.send(msg).then(() => {
          console.log('Message sent');
      }).catch((error) => {
          console.log(error.response.body);
          // console.log(error.response.body.errors[0].message)
      })
    }
    response.render('auth/login', {
      errors: function() {
        if (user.wrongLoginCount >= 4) {
          return ['You have entered too many wrong passwords!'] ;
        } else {
          return ['Password wrong'];
        }
      },
      values: request.body
    });
    return;
  }

	response.cookie("userId", user.id, {
    signed: true
  });
  response.redirect('/transactions');
};




