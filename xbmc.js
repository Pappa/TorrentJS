/*global console*/
var http = require('http'),
	rpc = require('./config/xbmcRpc'),
	config = require('./config/appConfig'),
	_ = require('underscore');

var Xbmc = function () {
	"use strict";

	var options = {
			auth: config.XBMC_USER + ":" + config.XBMC_PASS,
			host: config.APP_HOST,
			port: config.XBMC_PORT,
			path: "/jsonrpc",
			method: "POST",
			headers:  {
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

		request = function (rpcCall, args, callback) {
			var req,
				body = makeRpcReq(rpcCall, args),
				options = makeRpcReqHeaders(body);

			req = http.request(options, function (res) {
				res.setEncoding('utf8');
				var pageData = "";

				res.on('data', function (chunk) {
					pageData += chunk;
				});

				res.on('end', function () {
					var returnData = JSON.parse(pageData);
					returnData = returnData.result;
					callback(returnData);
				});

				res.on('error', function(e) {
					callback('problem with request: ' + e.message);
				});
			});

			req.write(JSON.stringify(body));
			req.end();

		};

	this.request = request;

};

module.exports = new Xbmc();
