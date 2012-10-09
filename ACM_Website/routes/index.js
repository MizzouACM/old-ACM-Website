var db = require('../db');


exports.users = function(req, res) {
	db.query('SELECT * FROM Users', function(err, rows) {

		res.render('user-test', { 
			users: rows,
		 });
	});
};
exports.index = function(req, res) {
	res.render('page', {title: 'Association for Computing Machinery', 
						showMission: true,
						pageContent: "Front page text here..." });
};
exports.calendar = function(req, res) {
	res.render('page', { title: 'Calendar',
						 pageContent: "Calendar text here..." });
};
exports.contact = function(req, res) {
	res.render('page', { title: 'Contact',
						 pageContent: "Contact page text here..."});
};
exports.about = function(req, res) {
	res.render('page', { title: 'About',
						 pageContent: "About page text here..."	});
};