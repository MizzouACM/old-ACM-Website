var db = require('../db');

exports.index = function(req, res) {
	res.render('home', {title: 'Association for Computing Machinery'});
};
exports.calendar = function(req, res) {
	res.render('calendar', { title: 'Calendar'});
};
exports.account = function(req, res) {
	res.render('account', { title: req.user.displayName});
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
	res.render('gallery', { title: 'Gallery',
						hideSidebar: true});
};
exports.createGroup = function(req, res) {
	res.render('createGroup', { title: 'Create an ACM Group'});
};
exports.groups = function(req, res) {
	db.groups.find({where: {name:req.params.name}}).success(function(result) {
		res.render('group', { title: result.name, group: result});
	});
};
