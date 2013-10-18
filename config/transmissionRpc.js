module.exports = {

	request: {
		"jsonrpc": "2.0"
	},

	calls: {
		"getAll": {
			"method": "torrent-get",
			"arguments": {
				"fields": ["id", "seedRatioLimit", "uploadRatio", "name", "sizeWhenDone", "isFinished", "percentDone", "status", "downloadDir"]
			}
		},
		"startTorrents": {
			"method": "torrent-start",
			"arguments": {
				"ids": ""
			}
		},
		"stopTorrents": {
			"method": "torrent-stop",
			"arguments": {
				"ids": ""
			}
		},
		"addTorrent": {
			"method": "torrent-add",
			"arguments": {
				"filename": "",
				"download-dir": ""
			}
		},
		"deleteTorrent": {
			"method": "torrent-remove",
			"arguments": {
				"ids": "",
				"delete-local-data": true
			}
		},
		"removeTorrent": {
			"method": "torrent-remove",
			"arguments": {
				"ids": "",
				"delete-local-data": false
			}
		}
	}
};