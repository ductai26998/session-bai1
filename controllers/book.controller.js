var db = require('../db');
const shortid = require('shortid');

module.exports.get = (request, response) => {
  var page = parseInt(request.query.page) || 1;
  var perPage = 8;
  var start = (page - 1) * perPage;
  var end = page * perPage;

  response.render('books/index', {
    page: page,
    books: db.get('books').value().slice(start, end)
  });
};

module.exports.search = (request, response) => {
  var q = request.query.q;
  var matchedBooks = db.get('books').value().filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  response.render('books/index', {
    books: matchedBooks
  });
};

module.exports.create = (request, response) => {
  response.render('books/create');
};

module.exports.postCreate = (request, response) => {
  request.body.id = shortid.generate();
  db.get('books').push(request.body).write();
  response.redirect('/');
};

module.exports.delete = (request, response) => {
  db.get('books').remove(request.params).write();
  response.redirect('/');
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
  response.redirect('/');
}