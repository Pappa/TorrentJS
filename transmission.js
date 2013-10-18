/*global console*/
var http = require('http'),
	rpc = require('./config/transmissionRpc'),
	config = require('./config/appConfig'),
	_ = require('underscore');

var Transmission = function () {
	"use strict";

	var RETRIES = 0,
		RETRY_LIMIT = 3,
		INVALID_HEADER = 400,
		csrfToken = null,
		options = {
			host: config.APP_HOST,
			port: config.TRANSMISSION_PORT,
			method: "POST",
			path: '/transmission/rpc',
			headers: {
				'x-transmission-session-id': '',
				'Content-Type': 'application/json',
				'Content-Length': 0
			}
		},

		makeRpcReq = function (call, args) {
			var rpcReq,
				arg;
			if (rpc.calls[call]) {
				rpcReq = _.extend(rpc.request, rpc.calls[call]);
				for (arg in args) {
					if (args.hasOwnProperty(arg)) {
						rpcReq.arguments[arg] = args[arg];
					}
				}
				return rpcReq;
			}
			return false;
		},

		makeRpcReqHeaders = function (body) {
			options.headers['Content-Length'] = JSON.stringify(body).length;
			return options;
		},

		getToken = function (callback) {
			var req;

			req = http.get(options, function (res) {

				res.on('end', function () {

					if (res && res.headers && res.headers['x-transmission-session-id']) {
						options.headers['x-transmission-session-id'] = res.headers['x-transmission-session-id'];
						csrfToken = res.headers['x-transmission-session-id'];
						callback(options.headers['x-transmission-session-id']);
					} else {
						callback();
					}

				});
			});
		},

		doRequest = function (rpcCall, args, callback) {
			var req,
				body = makeRpcReq(rpcCall, args),
				options = makeRpcReqHeaders(body),
				me = this;

			req = http.request(options, function (res) {
				res.setEncoding('utf8');
				var pageData = "";

				res.on('data', function (chunk) {
					pageData += chunk;
				});

				res.on('end', function () {
					var returnData;
					if (res.statusCode >= INVALID_HEADER && RETRIES <= RETRY_LIMIT) {
						RETRIES++;
						me.request(rpcCall, args, callback);
					} else if (RETRIES > RETRY_LIMIT) {
						RETRIES = 0;
						callback({
							error: 409
						});
					}
					returnData = JSON.parse(pageData);
					if (returnData && returnData.arguments && returnData.arguments.torrents) {
						returnData = returnData.arguments.torrents;
						RETRIES = 0;
						callback(returnData);
					} else {
						RETRIES = 0;
						callback('none');
					}
				});

				res.on('error', function(e) {
					callback('problem with request: ' + e.message);
				});
			});

			req.write(JSON.stringify(body));
			req.end();

		},

		request = function (rpcCall, args, callback) {

			if (csrfToken) {
				doRequest(rpcCall, args, callback);
			} else {
				this.getToken(
					function () {
						request(rpcCall, args, callback);
					},
					function () {
						console.log("getToken failed");
					}
				);
			}

		};

	this.getToken = getToken;
	this.request = request;

};

module.exports = new Transmission();
