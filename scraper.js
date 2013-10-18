var dgram = require('dgram'),
	server = dgram.createSocket("udp4"),
	trackerConfig = require('./config/trackerConfig'),
	trackerUtil = require('./trackerUtil'),
	udp = trackerConfig.udp,
	action,
	infoHashes = [],
	infoHash = '',
	infoHashesLength = 0,
	scrapeCallback,
	announceCallback,
	storedAction,
	sendPacket = function (buf, host, port) {
		"use strict";
		server.send(buf, 0, buf.length, port, host, function(err, bytes) {
			if (err) {
				console.log(err.message);
			}
		});
	},
	connect = function (host, port, action) {
		"use strict";
		var buf = trackerUtil.makeBuffer(trackerConfig.ACTION_CONNECT);

		storedAction = action;

		sendPacket(buf, host, port);
	},
	scrape = function (hashes, callback) {
		"use strict";
		var buf,
			data = {};

		scrapeCallback = callback;
		infoHashes = hashes;
		infoHashesLength = infoHashes.length;

		if (!udp.transactionId) {
			connect(trackerConfig.TRACKER_HOST, trackerConfig.TRACKER_PORT, trackerConfig.ACTION_SCRAPE);
		} else {

			data = {
				hashes: hashes
			};

			buf = trackerUtil.makeBuffer(trackerConfig.ACTION_SCRAPE, data);

			// do scrape
			sendPacket(buf, trackerConfig.TRACKER_HOST, trackerConfig.TRACKER_PORT);

			udp.transactionId = null;
		}

	},
	announce = function (hash, callback) {
		"use strict";
		var buf,
			data = {};

		announceCallback = callback;
		infoHash = hash;

		if (!udp.transactionId) {
			connect(trackerConfig.TRACKER_HOST, trackerConfig.TRACKER_PORT, trackerConfig.ACTION_ANNOUNCE);
		} else {

			data = {
				hash: hash,
				port: server.address().port
			};

			buf = trackerUtil.makeBuffer(trackerConfig.ACTION_ANNOUNCE, data);

			// do announce
			sendPacket(buf, trackerConfig.TRACKER_HOST, trackerConfig.TRACKER_PORT);

			udp.transactionId = null;
		}
	};

server.on("message", function (msg, rinfo) {
	"use strict";
	var buf = new Buffer(msg),
		data;

	action = buf.readUInt32BE(0, 4);
	udp.transactionId = buf.readUInt32BE(4, 4);

	if (action === trackerConfig.ACTION_CONNECT) {

		udp.connectionIdHigh = buf.readUInt32BE(8, 4);
		udp.connectionIdLow = buf.readUInt32BE(12, 4);

		if (storedAction === trackerConfig.ACTION_SCRAPE) {
			scrape(infoHashes, scrapeCallback);
		} else if (storedAction === trackerConfig.ACTION_ANNOUNCE) {
			announce(infoHash, announceCallback);
		}

	} else if (action === trackerConfig.ACTION_SCRAPE) {

		data = trackerUtil.extractScrapeData(infoHashes, buf);

		scrapeCallback(data);

	} else if (action === trackerConfig.ACTION_ANNOUNCE) {

		data = trackerUtil.extractAnnounceData(buf);

		announceCallback(data);

	} else if (action === trackerConfig.ACTION_ERROR) {
		console.log("error response");
	}
});

server.on("listening", function () {
	"use strict";
	var address = server.address();
	console.log("server listening " + address.address + ":" + address.port);
});

server.bind();

module.exports.scrape = scrape;
module.exports.announce = announce;
