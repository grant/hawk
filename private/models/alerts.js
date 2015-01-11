var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('alerts', {
	TripId: String,
	UserId: String,
	Name: String,
	Message: String
});