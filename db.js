var mysql = require('mysql');
var Sequelize = require("sequelize")
var sequelize;
if (!process.env.database) {
	var config = require('./config');
	sequelize = new Sequelize(process.env.database || config.database, process.env.user || config.user,  process.env.password || config.password, {
		host: process.env.host || config.host,
		port: process.env.dbPort || config.dbPort
	})
} else {
	sequelize = new Sequelize(process.env.database, process.env.user,  process.env.password, {
		host: process.env.host,
		port: process.env.dbPort
	})
}


var db = {};
db.users = sequelize.define('users', {
	GoogleId: Sequelize.STRING,
	name: Sequelize.STRING,
	email: Sequelize.STRING
})
db.comments = sequelize.define('comments', {
	type: Sequelize.STRING,
	comment: Sequelize.TEXT,
	page: Sequelize.STRING
})
db.users.hasOne(db.comments)
db.users.sync()
db.comments.sync()
db.groups = sequelize.define('groups', {
	name: Sequelize.STRING,
	description: Sequelize.STRING,
	meetingInformation: Sequelize.STRING,
	members: Sequelize.STRING
})
db.groups.sync()
db.resources = sequelize.define('resources', {
	name: Sequelize.STRING,
	description: Sequelize.STRING,
	link: Sequelize.STRING
})
db.resources.sync()
module.exports = db;