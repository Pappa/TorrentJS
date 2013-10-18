module.exports = {

	// UDP Tracker Config
	TRACKER_HOST: "tracker.publicbt.com",
	TRACKER_PORT: 80,
	ACTION_CONNECT: 0,
	ACTION_ANNOUNCE: 1,
	ACTION_SCRAPE: 2,
	ACTION_ERROR: 3,
	PEER_ID_PREFIX: '-TJ0001-',
	NUM_PEERS: 10, // Number of peers to request via announce
	udp: {
		connectionIdHigh: 0x417,
		connectionIdLow: 0x27101980,
		transactionId: null
	}


};