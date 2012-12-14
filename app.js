
/**
 * Module dependencies.
 */
'use strict';
var red, green, reset;
red   = '\u001b[31m';
green   = '\u001B[32m';
reset = '\u001b[0m';

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , db = require('./db')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

// configure Express
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'giftcards' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  // Add variables to every template
  app.use(function (req, res, next) {

    res.locals.user = req.user;
   
    next();

  });
	function resetGroupsCache() {
		console.log(green+"Reseting the groups cache"+reset);
		db.groups.findAll({ 
			attributes: ['name', 'members']
		}).success(function(results) {
			app.locals.groups = results; // pass group names to the menu on every page
		});
	}
	resetGroupsCache();
	setInterval(function() { //reset the group names every minute
		resetGroupsCache(); 
	}, 60000);
	// Message support
	app.use(function (req, res, next) {
		if (!req.session.message) {
			req.session.message = [];
		}
		res.locals.message = req.session.message;
		req.session.message = [];
		next();
	});
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

passport.serializeUser(function(user, done) {
	db.users.findAll({where: {"GoogleId": user._json.id}}).success(function(result) {
		if (result.length == 0) {
			db.users.create({GoogleId: user._json.id, name: user.displayName, email: user.emails[0].value}).success(function(result) {
			  console.log(red + "User " + result.GoogleId+ " has been added to the database."+reset);
			  setUserId(user,done);
			});
		} else {
			console.log(red+"User " + user.displayName + " already exists."+reset);
			setUserId(user,done);
		}
	});
});

function setUserId(user,done) {
	db.users.find({where: {"GoogleId": user._json.id}}).success(function(result) {
		user.id = result.id;
		done(null, user);
	});
}
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
var config = {};
if (!process.env.database) {
	config = require('./config');
	var callbackURL = "http://localhost:3000/auth/google/callback"; //locally
} else {
	var callbackURL = 'http://floating-caverns-9042.herokuapp.com/auth/google/callback';
}
passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClientID || config.GoogleClientID,
    clientSecret: process.env.GoogleClientSecret || config.GoogleClientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
		req.session.message.push({message: 'You are now logged in as ' + req.user.displayName + '.', type: 'success'});
		res.redirect('back');
  });

app.get('/logout', function(req, res){
  //console.log('Logging user ' + req.user.displayName + ' out');
  req.logout();
  res.redirect('back');
});

app.get('/createGroupCallback', function(req, res) {
	db.groups.create({name: req.query['name'], description: req.query['description'], meetingInformation: req.query['meetingInformation']}).success(function(result) {
		req.session.message.push({message: "You have created the " + req.query['name'] + " group.", type: 'success'});
		res.redirect('back');
	});
});

app.get('/postComment', function(req, res) {
	db.comments.create({comment: req.query['comment'], type: req.query['type'], userId: req.user.id, page: req.query['page']}).success(function(result) {
		res.redirect('back');
	});
});

app.get('/addGroupMember', ensureAuthenticated, function(req, res) {
	db.groups.find( {where: {name:req.query.group}}).success(function(group) {
		var members = ( group.members ? group.members.split(",") : [] );
		if (members.indexOf(req.user.id.toString()) == -1) { //user is not already in the group
			members.push(req.user.id);
			console.log(green+"User " + req.user.id+" has been added to group " + req.query.group + "." + reset);
			req.session.message.push({message: "You have joined the " + req.query.group + " group.", type: 'success'});
			group.members = members.join(','); //convert members to a string separated by commas
			group.save();
		}
		res.redirect('back'); //return to the page the user was on
	});
});
app.get('/removeGroupMember', ensureAuthenticated, function(req, res) {
	db.groups.find( {where: {name:req.query.group}}).success(function(group) {
		var members = ( group.members ? group.members.split(",") : [] );
		var memberIndex = members.indexOf(req.user.id.toString());
		if (memberIndex != -1) { //user is the group
			members.splice(memberIndex,1);
			console.log(red+"User " + req.user.id+" has been removed from the " + req.query.group + " group." + reset);
			req.session.message.push({message: "You have left the " + req.query.group + " group.", type: 'danger'});
			group.members = members.join(','); //convert members to a string separated by commas
			group.save();
		}
		res.redirect('back'); //return to the page the user was on
	});
});


app.get('/groups/:name', routes.groups);

app.get('/', routes.index);
app.get('/user/:userid', routes.user)
app.get('/calendar', routes.calendar)
app.get('/contact', routes.contact)
app.get('/about', routes.about)
app.get('/resources', routes.resources);
app.get('/gallery', routes.gallery);
app.get('/gallery/:img', routes.galleryimage);
app.get('/creategroup', routes.createGroup);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
 
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
