
/*
 * GET home page.
 */

var mojio = require('../mojio');

// Login page (go to login even if already logged in)
exports.index = function(req, res){
  res.render('index', {
    page: 'login'
  });
};

// Home page
exports.home = function(req, res){
  mojio.getData(function (alerts) {
    res.render('index', {
      page: 'home',
      alerts: alerts,
      user: req.user
    });
  });
};

exports.authError = function(req, res) {
  res.send('error');
};

exports.authSuccess = function(req, res) {
  res.redirect('/home');
};