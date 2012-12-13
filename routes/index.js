var db = require('../db');

exports.index = function(req, res) {
	res.render('home', {title: 'Association for Computing Machinery'});
};
exports.calendar = function(req, res) {
	res.render('calendar', { title: 'Calendar'});
};

exports.user = function(req, res) {
	db.users.find({where: {name:req.params.username}}).success(function(user) {
		if (user) {
			res.render('account', { title: user.name});
		} else {
			res.locals.message.push({message: "The user " + req.params.username + " does not exist", type: 'success'});
			res.render('home', {title: 'Association for Computing Machinery'});
		}
	});
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
		db.comments.findAll({where: {page:req.params.img}, order: 'createdAt DESC'}).success(function(comments) {
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
	db.users.findAll({attributes: ['id','name']}).success(function(users) {
		db.groups.find({where: {name:req.params.name}}).success(function(result) {
			db.comments.findAll({where: {type: 'group',page:req.params.name}, order: 'createdAt DESC'}).success(function(comments) {
				comments = proccessComments(comments, users);
				members = result.members || [];
				if (members.length) {
					members = members.split(',');
				}
				var currentUserIsMember = false;
				if (req.user && members.indexOf(req.user.id.toString()) != -1) {
					currentUserIsMember = true;
				}
				members = uidToNames(members, users);
				res.render('group', { title: result.name, meetingInformation: result.meetingInformation, description: result.description, members: members, currentUserIsMember:currentUserIsMember,comments:comments});
			});
		});
	});
};

function uidToNames(ids, users) { //convert user id's to user names
	userNames = [];
	ids.forEach(function(id) {
		users.some(function(user) {
			if (id == user.id) {
				userNames.push(user.name);
				return;
			}
		});
	});
	return userNames;
}