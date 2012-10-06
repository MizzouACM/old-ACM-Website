var db = require('../db');


exports.index = function(req, res) {
	db.query('SELECT * FROM Users', function(err, rows) {

		res.render('home', { 
			title: 'Association for Computing Machinery', 
			users: rows,
		 });
	});
};
exports.calendar = function(req, res) {
	res.render('page', { title: 'Calendar' });
};
exports.contact = function(req, res) {
	res.render('page', { title: 'Contact' });
};
exports.about = function(req, res) {
	res.render('page', { title: 'About' });
};