var bcrypt = require('bcrypt');
var db = require('../db');
var cloudinary = require('cloudinary').v2;

const shortid = require('shortid');

cloudinary.config({ 
  cloud_name: 'ductai26998', 
  api_key: '744596793339385', 
  api_secret: '_jqie405YJR-Jct1XSBwKkbUUy8' 
});

module.exports.get = (request, response) => {
  response.render('users/index', {
    users: db.get('users').value()
  });
};

module.exports.search = (request, response) => {
  var q = request.query.q;
  var matchedUsers = db.get('users').value().filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  response.render('users/index', {
    users: matchedUsers
  });
};

module.exports.create = (request, response) => {
  console.log(request.cookies);
  response.render('users/create');
}

module.exports.postCreate = (request, response) => {
  request.body.id = shortid.generate();
  if (!request.file) {
    request.body.avatar = "updates/avt.jpg";
  } else {
    request.body.avatar = request.file.path.split("\\").slice(1).join("/");
    cloudinary.uploader.upload(request.body.avatar, function(error, result) {
      console.log(result, error)
    });
  }
  request.body.isAdmin = "false";
  request.body.wrongLoginCount = 0;
  bcrypt.hash(request.body.password, 10, function(err, hash) {
      // Store hash in your password DB.
      console.log(hash);
      request.body.password = hash;
       console.log(request.body);
  db.get('users').push(request.body).write();
  });
 
  response.redirect('/users');
};

module.exports.delete = (request, response) => {
  // var id = request.params.id;
  db.get('users').remove(request.params).write();
  response.redirect('/users');
};

module.exports.profile = (request, response) => {
  response.render('users/profile', {
    id: request.params.id,
    user: db.get('users').find({id: request.params.id}).value(),
    getAvatarUrl: function(url) {
      if (url.indexOf('http') === 0) {
        return url;
      }
      return '/' + url;
    }
  });
};

module.exports.postProfile = (request, response) => {
  var userId = request.params.id;
  db.get('users')
    .find({id: userId})
    .assign({
      name: request.body.name,
      phone: request.body.phone,
      email: request.body.email
    })
    .write();
  response.redirect('/users');
};

module.exports.avatar = (request, response) => {
  response.render('users/avatar', {
    id: request.params.id
  });
}

module.exports.postAvatar = async (request, response) => {
  var id = request.params.id;
  if (!request.file) {
    request.body.avatar = "https://hinhanhdephd.com/wp-content/uploads/2020/07/hinh-anh-mat-cuoi-sieu-cute-dang-yeu-14-600x375.jpg";
  } else {
    request.body.avatar = request.file.path.split("\\").slice(1).join("/");
    const result = await cloudinary.uploader.upload(request.file.path);

    db.get('users')
    .find({ id: id })
    .assign({
      avatar: request.body.avatar
    })
    .write();
  }
  response.redirect('/users/' + id + '/profile');
};