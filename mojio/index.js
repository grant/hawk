var AuthKey = '0d53368f-1280-4f4c-b16b-ea191ec4c6a3',
	request = require('request'),
	TripDataSchema = require('../private/models/tripdata'),
	TripSchema = require('../private/models/trips'),
	AlertSchema = require('../private/models/alerts'),
	moment = require('moment'),
	GeoDist = require('geodist'),
	HOME_COORD = {lat: 37.571633, lng: -122.418558},
	RADIUS = 10,
	delay = 300000;

var getDataRoute = function (req, res) {
	getData(function (data) {
		cb(data);
	});
};

var getData = function (cb) {
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
							cb({status: 'fail'});
						} else {
							cb({status: 'pass'});
						}
					});
				});
		} else {
			cb({status: 'failtogetdata'});
		}
	});
};

var getAlerts = function (cb) {
	TripDataSchema.find({}, function(error, data){
		data = data.filter(function(value){
			if(value.Speed && value.SpeedLimit){
				return true;
			}
		});
		var result = [];
		var lastSpeedTime = 0;
		var lastGeoTime = 0;
		var lastBattTime = 0;
		for (var i in data) {
			
			var iTime = new Date(data[i].Time).getTime();

			if(data[i].Speed - data[i].SpeedLimit > 5 && iTime >= lastSpeedTime + delay){
				result.push({
					name : 'Speeding',
					key: 'speed',
					time : iTime,
					relative_time: moment(iTime).fromNow(),
					TripId: data[i].TripId,
					info : 'Car is going at ' + data[i].Speed + 'kmph and the Speed Limit is ' + data[i].SpeedLimit + 'kmph'
				});
				lastSpeedTime = iTime;
			}

			var diff = GeoDist(HOME_COORD, {lat : data[i].Location.Lat, lng: data[i].Location.Lng}, {exact: true, unit: 'km'}) - RADIUS;
			if(diff > 0 && iTime >= lastGeoTime + delay){
				result.push({
					name : 'Out of Region',
					key: 'geo',
					time : iTime,
					relative_time: moment(iTime).fromNow(),
					TripId: data[i].TripId,
					info : 'Car is ' + Math.round(diff * 10) / 10 + 'km far from home'
				});
				lastGeoTime = iTime;
			}

			if(data[i].BatteryLevel < 25 && iTime >=  lastBattTime + delay){
				result.push({
					name : 'Battery Low',
					key: 'battery',
					time : iTime,
					relative_time: moment(iTime).fromNow(),
					TripId: data[i].TripId,
					info : 'Cars Battery Level is ' + data[i].BatteryLevel + '%'
				});
				lastBattTime = iTime;
			}
		}

		result.sort(function(a, b){ return b.time - a.time });

		cb(result);
	});
};
var getAlertsRoute = function (req, res) {
	getAlerts(function (alerts) {
		res.json(alerts);
	});
};

module.exports = {

	getSpeedLimit: getSpeedLimitFunction,

	getData: getData,
	getDataRoute: getDataRoute,

	getAlerts: getAlerts,
	getAlertsRoute: getAlertsRoute,

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




