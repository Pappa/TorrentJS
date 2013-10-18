(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Models = TJS.Models || {};

	TJS.Models.Torrent = Backbone.Model.extend({
		defaults: {
			name: "Torrent"
		},

		startDownload: function () {
			$.ajax({
				url: "/transmission?call=startTorrents",
				data: {
					args: JSON.stringify({
						ids: this.get('id')
					})
				},
				success: function (data) {
					window.setTimeout(function () {
						TJS.Events.trigger('torrent:update', data);
					}, 500);
				}
			});
		},

		stopDownload: function () {
			$.ajax({
				url: "/transmission?call=stopTorrents",
				data: {
					args: JSON.stringify({
						ids: this.get('id')
					})
				},
				success: function (data) {
					window.setTimeout(function () {
						TJS.Events.trigger('torrent:update', data);
					}, 500);
				}
			});
		}
	});

}(TJS, $, _, Backbone));
