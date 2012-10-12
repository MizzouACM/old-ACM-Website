var mysql = require('mysql');
var config = require('./config');


// Set up connection from config
var db = mysql.createConnection({
	host : config.mysql.host,
	user : config.mysql.user,
	password : config.mysql.password,
	database : config.mysql.database,
});

// Connect to database
db.connect(function(err) {
	if (!err) {
		console.log('Server successfully connected to database with the following:');
	}
	else {
		console.log('Server failed to connect to database with the following:')
		//throw err;	// Disable this to make the server still work without db connection
	}

	console.log('host:  ' + config.mysql.host);
	console.log('user:  ' + config.mysql.user);
	console.log('database:  ' + config.mysql.database);

});


// Function to handle disconnects according to node-mysql
function handleDisconnect(connection) {
	connection.on('error', function(err) {
		if (!err.fatal) {
			return;
		}

		if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
			throw err;
		}

		console.log('Re-connecting lost connection: ' + err.stack);

		connection = mysql.createConnection(connection.config);
		handleDisconnect(connection);
		connection.connect();
	});
}

handleDisconnect(db);

module.exports = db;
