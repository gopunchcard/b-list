var noble = require('noble');
//var Scanner = require('bluetooth-scanner');
var xhr = require('xhr');

noble.on('stateChange', function (state) {
	if (state === 'poweredOn') {
		setInterval(noble.startScanning(), 60000);
		console.log("Scanning...")
	} else {
		noble.stopScanning();
	}
});

noble.on('discover', function (peripheral) {
	var macAddress = peripheral.address;
	console.log('found device: ', macAddress);
	xhr.post('http://localhost:3010/bluetooth', function (err, resp) {
		console.log(resp.body)
	})
});
