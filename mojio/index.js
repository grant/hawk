var AuthKey = '0d53368f-1280-4f4c-b16b-ea191ec4c6a3',
	request = require('request'),
	TripDataSchema = require('../private/models/tripdata'),
	TripSchema = require('../private/models/trips'),
	AlertSchema = require('../private/models/alerts'),
	GeoDist = require('geodist');

var getdata = function(req, res) {
	request({
			url: 'http://data.api.hackthedrive.com:80/v1/Events?limit=1&offset=0&sortBy=Time&desc=true',
			headers: {
				'MojioAPIToken' : AuthKey
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var rawdata = JSON.parse(body).Data[0];
				// TripSchema.findOne({TripId : rawdata.TripId}, function(err, trip){
				// 	if(!trip){
				// 		var trip = {

				// 		}
				// 	}
				// });

				var tripsData = {
					TripId: rawdata.TripId,
					Speed: rawdata.Speed,
					Distance: rawdata.Distance,
					Odometer: rawdata.Odometer,
					FuelEfficiency: rawdata.FuelEfficiency,
					SteeringWheelAngle: rawdata.SteeringWheelAngle,
					Gear: rawdata.Gear,
					Location: rawdata.Location,
					Accelerometer: rawdata.Accelerometer,
					AcceleratorPedal: rawdata.AcceleratorPedal,
					Time: rawdata.Time,
					ConnectionLost: rawdata.ConnectionLost,
					BatteryLevel: rawdata.BatteryLevel,
					TemperatureInside: rawdata.TemperatureInside,
					TemperatureOutside: rawdata.TemperatureOutside
				};

				getSpeedLimitFunction(rawdata.Location.Lat, rawdata.Location.Lng, 
					function(speedlim){
						tripsData.SpeedLimit = speedlim;
						var recordTripData = new TripDataSchema(tripsData);
						recordTripData.save(function(error){
							if(error){
								console.log(error);
								res.status(500).json({status: 'fail'});
							} else {
								res.json({status: 'pass'});
							}
						});
					});
			} else {
				res.status(500).json({status: 'failtogetdata'});
			}
		});
}

var getalerts = function(req, res) {

}

module.exports = {

	getSpeedLimit: getSpeedLimitFunction,

	getData: getdata,

	getAlerts: getalerts,

	isSpeeding: function (speed, limit) {
		return speed - limit > 5;
	},
	// Home and cur are objects are {lat, lng}
	isOutOfRegion: function (home, cur, radius) {
		return GeoDist(home, cur) - radius > 0;
	}
}; 

var getSpeedLimitFunction = function (lat, lng, cb) {
	var link = 'http://route.st.nlp.nokia.com/routing/6.2/getlinkinfo.json?waypoint='+lat+','+lng+'&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg';
	request(link, function (error, response, body){
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			if(data.Response.Link[0].SpeedLimit){
				cb(data.Response.Link[0].SpeedLimit);
			} else if(data.Response.Link[0].DynamicSpeedInfo.BaseSpeed) {
				console.log(data.Response.Link[0].DynamicSpeedInfo.BaseSpeed);
				cb(data.Response.Link[0].DynamicSpeedInfo.BaseSpeed);
			} else {
				console.log('nope nothing');
				cb(null);
			}
		} else {
			console.log('didnt get the here api data');
			cb(null);
		}
	});
}




