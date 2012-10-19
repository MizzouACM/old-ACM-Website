var db = require('../db');


exports.users = function(req, res) {
	db.query('SELECT * FROM Users', function(err, rows) {

		res.render('user-test', { 
			users: rows,
		 });
	});
};
exports.index = function(req, res) {
	res.render('home', {title: 'Association for Computing Machinery'});
};
exports.calendar = function(req, res) {
	res.render('calendar', { title: 'Calendar'});
};
exports.contact = function(req, res) {
	res.render('contact', { title: 'Contact'});
};
exports.about = function(req, res) {
	res.render('about', { title: 'About',
						showMission: true});
};
exports.resources = function(req, res) {
	res.render('resources', { title: 'Resources'});
};