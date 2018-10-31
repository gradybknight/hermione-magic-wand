var phidget22 = require('phidget22');

var SERVER_PORT = 5661;

function main() {

	if (process.argv.length != 3) {
		console.log('usage: node Accelerometer.js <server address>');
		process.exit(1);
	}
	var hostname = process.argv[2];

	console.log('connecting to:' + hostname);
	var conn = new phidget22.Connection(SERVER_PORT, hostname, {
		name: 'Server Connection',
		passwd: '',
		onError: function (code, msg) { console.error("Connection onError", msg); },
		onConnect: function (code, msg) { console.log("Connected"); },
		onDisconnect: function (code, msg) { console.log("Disconnected"); }
	});
	conn.connect()
		.then(runExample)
		.catch(function (err) {
			console.error('Error running example:', err.message);
			process.exit(1);
		});
}

function runExample() {

	var ch = new phidget22.Accelerometer();

	ch.onAttach = function (ch) {
		console.log(ch + ' attached');
		console.log('Min Acceleration:' + ch.getMinAcceleration());
		console.log('Max Acceleration:' + ch.getMaxAcceleration());
	};

	ch.onDetach = function (ch) {
		console.log(ch + ' detached');
	};

	ch.onAccelerationChange = function (acc, timestamp) {
		var gacc = this.getAcceleration();
		console.log('acc x:' + acc[0] + ' (' + gacc[0] + ')' +
			' y:' + acc[1] + '(' + gacc[1] + ') z:' + acc[2] + ' (' + gacc[2] + ')');
		console.log('timestamp: ' + timestamp);
		console.log('');
	};

	ch.onError = function (code, msg) {
		console.error("Channel error", msg);
	};

	ch.open().then(function (ch) {
		console.log('channel open');
	}).catch(function (err) {
		console.log('failed to open the channel:' + err);
	});
}

if (require.main === module)
	main();
	// runExample();