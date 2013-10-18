var config = require('./config/appConfig'),
	util = require('util'),
	fs = require('fs');

var AppUtil = (function () {
	"use strict";

	return {
		getConfig: function () {
			var settings = util._extend({}, config);
			settings.XBMC_PASS = '';
			return settings;
		},
		setConfig: function (config, success, error) {
			if (config && config.name) {
				delete config.name;
			}
			console.log(JSON.stringify(config, true, 4));
			fs.writeFile('config/appConfig.js', 'module.exports = ' + JSON.stringify(config, true, 4) + ';', function (err) {
				if (err) {
					error(err);
				}
				success();
			});
		}
	};

}());

module.exports = AppUtil;