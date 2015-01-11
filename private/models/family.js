var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('family', {
	id: Number,
	vin: String,
	parent: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	kid: {
		name: String,
		picture: String
	},
	settings : {
		speed: Number,
		location: {
			enable: Number,
			radius: Number
		}
	}
});