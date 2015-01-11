
/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var login = require('./private/login')(passport);
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mojio = require('./mojio');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var twilio = require('./private/twilio');

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGOLAB_URI);

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(session({
    secret: 'foo',
    store: new MongoStore({
      url: process.env.MONGOLAB_URI
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/auth/facebook', passport.authenticate("facebook", {scope:'email'}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/error' }), routes.authSuccess);
app.get('/api/getdata', mojio.getDataRoute);
app.get('/api/alerts', mojio.getAlertsRoute);
app.get('/api/location', mojio.getLocation);
app.post('/twilio', function(req, res){
	twilio(req.body.msg);
	res.send({status: 200});
});

setInterval(function () {
  mojio.getData(function (data) {
    // do nothing
  });
}, 15000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

