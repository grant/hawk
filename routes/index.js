
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    page: 'login'
  });
};

exports.authError = function(req, res) {
  res.send('error');
};

exports.authSuccess = function(req, res) {
  res.render('index', {
    page: 'home'
  });
};