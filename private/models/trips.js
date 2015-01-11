var mongoose = require('mongoose');
module.exports = mongoose.model('trips', {
	family_id: Number,
	vin: String,
	start_time: String,
	end_time: String,
	stats: {
		fuel_eff: Number,
		fuel_consumed: Number,
		distance: Number,
	}
});