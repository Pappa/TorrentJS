module.exports = {

	request: {
		"jsonrpc": "2.0"
	},

	calls: {
		"getVideoSources": {
			"method": "Files.GetSources",
			"id": 1,
			"params": {
				"media": "video"
			}
		},
		"getAudioSources": {
			"method": "Files.GetSources",
			"id": 1,
			"params": {
				"media": "audio"
			}
		}
	}
};