var db = require('../db');
const shortid = require('shortid');
var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'ductai26998', 
  api_key: '744596793339385', 
  api_secret: '_jqie405YJR-Jct1XSBwKkbUUy8' 
});

module.exports.get = (request, response) => {
  var page = parseInt(request.query.page) || 1;
  var perPage = 8;
  var start = (page - 1) * perPage;
  var end = page * perPage;

  var user = db.get('users').find({id: request.signedCookies.userId}).value();

  response.render('books/index', {
    isAdmin: function() {
      if (!user || user.isAdmin !== "true") {
        return false;
      }
      return true;
    },
    page: page,
    books: db.get('books').value().slice(start, end),
    getCoverUrl: function(url) {
      if (url.indexOf('http') === 0) {
        return url;
      }
      return '/' + url;
    }
  });
};

module.exports.search = (request, response) => {
  var q = request.query.q;
  var matchedBooks = db.get('books').value().filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  response.render('books/index', {
    books: matchedBooks,
    getCoverUrl: function(url) {
      if (url.indexOf('http') === 0) {
        return url;
      }
      return '/' + url;
    }
  });
};

module.exports.create = (request, response) => {
  response.render('books/create');
};

module.exports.postCreate = (request, response) => {
  request.body.id = shortid.generate();
  if (!request.file) {
    request.body.cover = "updates/avt.jpg";
  } else {
    request.body.cover = request.file.path.split("\\").slice(1).join("/");
    cloudinary.uploader.upload(request.body.cover, function(error, result) {
      console.log(result, error)
    });
  }
  db.get('books').push(request.body).write();

  response.redirect('/books');
};

module.exports.delete = (request, response) => {
  db.get('books').remove(request.params).write();
  response.redirect('/books');
};

module.exports.update = (request, response) => {
  response.render('books/update', {id: request.params.id});
};

module.exports.postUpdate = (request, response) => {
  var bookId = request.params.id;
  db.get('books')
    .find({id: bookId})
    .assign({title: request.body.title})
    .write();
  response.redirect('/books');
}