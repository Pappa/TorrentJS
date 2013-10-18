var http = require('http'),
	express = require('express'),
	Search = require('./search'),
	Transmission = require('./transmission'),
	Xbmc = require('./xbmc'),
	Scraper = require('./scraper'),
	app = express(),
	appUtil = require('./appUtil'),
	config = require('./config/appConfig');

app.use(express.bodyParser());

app.use('/', express.static(__dirname + '/app'));

app.use(app.router);

app.get('/:route', function (req, res) {
	"use strict";

	var callback = function (obj) {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(obj, true, 4));
			res.end();
		},
		infoHashes = req.query.info_hashes || [],
		args = (req.query.args) ? JSON.parse(req.query.args) : null,
		rpcCall = req.query.call || null;

	switch (req.params.route) {
		case "search":

			if (req.query && req.query.q) {
				Search.search(req.query, callback);
			}

		break;
		case "scrape":

			if (infoHashes) {
				Scraper.scrape(infoHashes, callback);
			}

		break;
		case "transmission":

			if (rpcCall) {
				Transmission.request(rpcCall, args, callback);
			}

		break;
		case "xbmc":

			if (rpcCall) {
				Xbmc.request(rpcCall, args, callback);
			}

		break;
		case "settings":
			callback(appUtil.getConfig());

		break;
		default:
		break;
	}

});

app.post('/settings', function (req, res) {
	"use strict";
	var success = function () {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(req.body, true, 4));
			res.end();
		},
		error = function (err) {
			res.writeHead(418, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(err, true, 4));
			res.end();
		};

	appUtil.setConfig(req.body, success, error);

});

app.listen(process.env.PORT || 2000);
console.log('Listening on port 2000');
