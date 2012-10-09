var db = require('../db');


exports.users = function(req, res) {
	db.query('SELECT * FROM Users', function(err, rows) {

		res.render('user-test', { 
			users: rows,
		 });
	});
};
exports.index = function(req, res) {
	res.render('page', { title: 'Association for Computing Machinery', showMission: true });
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