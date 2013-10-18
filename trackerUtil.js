var Config = require('./config/trackerConfig');

var TrackerUtil = (function () {
	"use strict";

	function dot2num(dot) {
		var d = dot.split('.');
		return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
	}

	function num2dot(num) {
		var d = num % 256,
			i;
		for (i = 3; i > 0; i--)
		{
			num = Math.floor(num/256);
			d = num%256 + '.' + d;
		}
		return d;
	}

	function makeTransactionId() {
		return Math.floor((Math.random()*100000)+1);
	}

	function makePeerId() {
		var LENGTH = 20,
			prefix = Config.PEER_ID_PREFIX,
			suffixLength = LENGTH - prefix.length;
		return prefix + Math.random().toString(36).substring(0, suffixLength);
	}

	function extractScrapeData(infoHashes, buf) {
		var returnObj = {},
			seedersOffset = 8,
			leechersOffset = 16,
			RESULT_SIZE = 12,
			infoHashesLength = infoHashes.length,
			i;

		for (i = 0; i < infoHashesLength; i++) {
			returnObj[infoHashes[i]] = {
				seeders: buf.readUInt32BE(seedersOffset, 4),
				leechers: buf.readUInt32BE(leechersOffset, 4)
			};
			seedersOffset = seedersOffset + RESULT_SIZE;
			leechersOffset = leechersOffset + RESULT_SIZE;
		}
		return returnObj;
	}

	function extractAnnounceData(buf) {
		var returnArray = [],
			ipOffset = 20,
			portOffset = 24,
			i;

		for (i = 0; i < Config.NUM_PEERS; i++) {
			returnArray.push({
				ip: num2dot(buf.readUInt32BE(ipOffset, 4)),
				port: buf.readUInt16BE(portOffset, 2)
			});
			ipOffset = ipOffset + 6;
			portOffset = portOffset + 6;
		}

		return returnArray;
	}

	function makeBuffer(action, data) {
		var buf,
			scrapeHashOffset = 16,
			HASH_SIZE = 20,
			hashes = [],
			hashesLength = 0,
			bufferLength = 0,
			i = 0;

		switch (action) {
		case Config.ACTION_CONNECT:

			buf = new Buffer(16);

			Config.udp.transactionId = makeTransactionId();

			buf.fill(0);

			buf.writeUInt32BE(Config.udp.connectionIdHigh, 0);
			buf.writeUInt32BE(Config.udp.connectionIdLow, 4);
			buf.writeUInt32BE(Config.ACTION_CONNECT, 8);
			buf.writeUInt32BE(Config.udp.transactionId, 12);

			break;
		case Config.ACTION_SCRAPE:

			hashes = data.hashes;
			hashesLength = hashes.length;

			bufferLength = (hashesLength * HASH_SIZE) + scrapeHashOffset;

			buf = new Buffer(bufferLength);

			buf.fill(0);

			buf.writeUInt32BE(Config.udp.connectionIdHigh, 0);
			buf.writeUInt32BE(Config.udp.connectionIdLow, 4);
			buf.writeUInt32BE(Config.ACTION_SCRAPE, 8);
			buf.writeUInt32BE(Config.udp.transactionId, 12);
			for (i = 0; i < hashesLength; i++) {
				buf.write(hashes[i], scrapeHashOffset, HASH_SIZE, 'hex');
				scrapeHashOffset = scrapeHashOffset + HASH_SIZE;
			}

			break;
		case Config.ACTION_ANNOUNCE:

			buf = new Buffer(98);

			buf.fill(0);

			buf.writeUInt32BE(Config.udp.connectionIdHigh, 0);
			buf.writeUInt32BE(Config.udp.connectionIdLow, 4);
			buf.writeUInt32BE(Config.ACTION_ANNOUNCE, 8);
			buf.writeUInt32BE(Config.udp.transactionId, 12);
			buf.write(data.hash, 16, 20, 'hex');
			buf.write(makePeerId(), 36, 20);
			buf.writeUInt32BE(0, 56); // downloaded
			buf.writeUInt32BE(0, 60); // 64 bit number split
			buf.writeUInt32BE(0, 64); // left
			buf.writeUInt32BE(0, 68); // 64 bit number split
			buf.writeUInt32BE(0, 72); // uploaded
			buf.writeUInt32BE(0, 76); // 64 bit number split
			buf.writeUInt32BE(0, 80); // event
			buf.writeUInt32BE(0, 84); // IP
			buf.writeUInt32BE(0, 88); // key
			buf.writeUInt32BE(Config.NUM_PEERS, 92); // num_want
			buf.writeUInt16BE(data.port, 96); // port
			break;
		}

		return buf;

	}

	return {
		dot2num: dot2num,
		num2dot: num2dot,
		makeTransactionId: makeTransactionId,
		makePeerId: makePeerId,
		extractScrapeData: extractScrapeData,
		extractAnnounceData: extractAnnounceData,
		makeBuffer: makeBuffer
	};

}());

module.exports = TrackerUtil;