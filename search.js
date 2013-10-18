/*global console*/
var http = require('http'),
	events = require('events'),
	util = require('util'),
	zlib = require('zlib'),
	searchConfig = require('./config/searchConfig');

var Search = function () {
	"use strict";

	var me = this,
		MAGNET_LIMIT = 10,

		returnCallback,

		search,
		makeReturnArray,
		requestPageData,
		sendResults,

		testingResultsObj = [
			{
				"magnet": "magnet:?xt=urn:btih:79f279fb08098729275342504af9f028d641a6d2&amp;dn=Dexter+S07E12+HDTV+x264-ASAP+%5Beztv%5D&amp;tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80",
				"id": "79f279fb08098729275342504af9f028d641a6d2",
				"title": "Dexter S07E12 HDTV x264-ASAP [eztv]"
			},
			{
				"magnet": "magnet:?xt=urn:btih:da17f07b31e8aa4c4482d4be7c9db03d498925db&amp;dn=Dexter+S07E11+HDTV+x264-EVOLVE+%5Beztv%5D&amp;tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80",
				"id": "da17f07b31e8aa4c4482d4be7c9db03d498925db",
				"title": "Dexter S07E11 HDTV x264-EVOLVE [eztv]"
			},
			{
				"magnet": "magnet:?xt=urn:btih:a23826f6df1f5dd02a6b1d1247e3f9187141aea9&amp;dn=Dexter+S07E10+HDTV+x264-ASAP+%5Beztv%5D&amp;tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80",
				"id": "a23826f6df1f5dd02a6b1d1247e3f9187141aea9",
				"title": "Dexter S07E10 HDTV x264-ASAP [eztv]"
			}
		];

	events.EventEmitter.call(this);

	search = function (query, callback) {
		returnCallback = callback;
		if (query.test) {
			this.emit("sendResults", testingResultsObj);
		} else {

			this.emit("requestPageData", query.q);
		}
	};

	requestPageData = function (query, n) {
		var req,
			options,
			i = n || 0,
			searchSites = searchConfig.sites,
			searchSitesLength = searchConfig.sites.length,
			TORRENT_MATCH_PATTERN = /(magnet:[^"']+)/g;

		if (!searchSites[i]) {
			me.emit("sendResults", []);
			return;
		}

		options = {
			host: searchSites[i].host,
			port: searchSites[i].port,
			path: searchSites[i].path[0] + query + searchSites[i].path[1],
			method: searchSites[i].method,
			headers: searchConfig.headers
		};


		req = http.get(options, function (res) {
			var pageData = "",
				resultsArray = [],
				output,
				gzip;


			if (res.headers && (res.headers['content-encoding'] === 'gzip' || res.headers['content-encoding'] === 'deflate')) {
				gzip = zlib.createGunzip();
				res.pipe(gzip);
				output = gzip;
			} else {
				output = res;
			}

			output.on('data', function (chunk) {
				pageData += chunk.toString('utf-8');
			});

			output.on('end', function () {
				resultsArray = pageData.match(TORRENT_MATCH_PATTERN);
				if (!resultsArray || resultsArray.length === 0) {
					requestPageData(query, i + 1);
				}
				if (resultsArray && resultsArray.length > MAGNET_LIMIT) {
					resultsArray.length = MAGNET_LIMIT;
				}
				if (resultsArray && resultsArray.length) {
					me.emit("makeReturnArray", resultsArray);
				}
			});
		});
	};

	makeReturnArray = function (magnetArray) {
		var i,
			returnArray = [],
			hash = [],
			title = [],
			result,
			INFO_HASH_MATCH_PATTERN = /btih:([a-zA-Z0-9]+)\&/,
			TITLE_MATCH_PATTERN = /(&amp;|&)dn=(.+?)(&|$)/;

		if (magnetArray) {
			for (i = 0; i < magnetArray.length; i++) {
				result = {};
				result.magnet = magnetArray[i];
				hash = magnetArray[i].match(INFO_HASH_MATCH_PATTERN);
				if (hash && hash[1]) {
					result.id = hash[1];
				}
				title = magnetArray[i].match(TITLE_MATCH_PATTERN);
				if (title && title[2]) {
					result.title = decodeURIComponent(title[2].replace(/\+/g, '%20'));
				}
				returnArray.push(result);

			}
		}
		this.emit("sendResults", returnArray);
	};

	sendResults = function (obj) {
		returnCallback(obj);
	};

	this.on("makeReturnArray", makeReturnArray);

	this.on("requestPageData", requestPageData);

	this.on("sendResults", sendResults);

	this.search = search;

};

util.inherits(Search, events.EventEmitter);
module.exports = new Search();
