var mysql = require('mysql');
var config = require('./config');
var Sequelize = require("sequelize")
var db = {};
var sequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
//	logging: false //comment out this line to show all db queries in console
})
db.users = sequelize.define('users', {
	GoogleId: Sequelize.TEXT,
	name: Sequelize.TEXT,
	email: Sequelize.TEXT
})
db.users.sync()
module.exports = db;