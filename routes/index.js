var db = require('../db');

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
exports.gallery = function(req, res) {
	res.render('gallery', { title: 'Gallery'});
};
exports.createGroup = function(req, res) {
	res.render('createGroup', { title: 'Create an ACM Group'});
};