var mysql = require('mysql');
var config = require('./config');
var Sequelize = require("sequelize")
var db = {};
var sequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
	port: config.dbPort
//	logging: false //comment out this line to show all db queries in console
})
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