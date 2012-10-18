
/**
 * Module dependencies.
 */
'use strict';
var red, reset;
red   = '\u001b[31m';
reset = '\u001b[0m';

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , db = require('./db')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

// configure Express
app.configure(function() {
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
//  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'giftcards' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  // Add variables to every template
  app.use(function (req, res, next) {
    app.locals.user = req.user;
    next();
  });
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
var env = process.env.NODE_ENV || 'development';
if (env == 'development') {
	var callbackURL = "http://localhost:3000/auth/google/callback"; //locally
} else {
	var callbackURL = "http://immense-inlet-3117.herokuapp.com/auth/google/callback"; //on Heroku
}
passport.use(new GoogleStrategy({
    clientID: '183030661841.apps.googleusercontent.com',
    clientSecret: '4E3rNxQHcNbyQMsdOv2sH7gc',
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
	db.users.findAll({where: ["GoogleId = ?", req.user._json.id]}).success(function(result) {
		if (result.length == 0) {
			db.users.create({GoogleId: req.user._json.id, name: req.user.displayName, email: req.user.emails[0].value}).success(function(result) {
			  console.log(red + "User " + result.GoogleId+ " has been added to the database."+reset);
			});
		} else {
			console.log(red+"User " + req.user.displayName + " already exists."+reset);
		}
	});
    res.redirect('/loggedin');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/loggedin',ensureAuthenticated,routes.index);
app.get('/', routes.index);
app.get('/calendar', routes.calendar)
app.get('/contact', routes.contact)
app.get('/about', routes.about)
app.get('/users', routes.users);


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
