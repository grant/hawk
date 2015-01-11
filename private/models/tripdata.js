var mongoose = require('mongoose');
module.exports = mongoose.model('tripdata', {
	TripId: String,
	Speed: Number,
	SpeedLimit: Number,
	Distance: Number,
	Odometer: Number,
	FuelEfficiency: Number,
	SteeringWheelAngle: Number,
	Gear: String,
	Location: Object,
	Accelerometer: Object,
	AcceleratorPedal: Number,
	Time: String,
	ConnectionLost: String,
	BatteryLevel: Number,
	TemperatureInside: Number,
	TemperatureOutside: Number
});