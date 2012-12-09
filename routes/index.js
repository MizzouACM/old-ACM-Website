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
	res.render('about', { title: 'About'});
};
exports.resources = function(req, res) {
	res.render('resources', { title: 'Resources'});
};
exports.gallery = function(req, res) {
	res.render('gallery', { title: 'Gallery', showSidebar: true});
};
exports.galleryimage = function(req, res) {
	db.users.findAll({attributes: ['id','name']}).success(function(users) {
		db.comments.findAll({where: {page:req.params.img}}).success(function(comments) {
			comments = proccessComments(comments, users);
			res.render('galleryimage', {img:req.params.img, title: '', comments: comments});
		});
	});
};

function proccessComments(comments, users) {
	comments.forEach(function(comment) {
		users.some(function(user) {
			if (comment.userId == user.id) {
				comment.name = user.name;
				return;
			}
		});
		var d = new Date(comment.createdAt);
		comment.date = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
	});
	return comments;
}

exports.createGroup = function(req, res) {
	res.render('createGroup', { title: 'Create an ACM Group'});
};
exports.groups = function(req, res) {
	db.groups.find({where: {name:req.params.name}}).success(function(result) {
		res.render('group', { title: result.name, group: result});
	});
};
