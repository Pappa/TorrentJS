(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Collections = TJS.Collections || {};

	TJS.Collections.Torrents = Backbone.Collection.extend({
		initialize: function (models, options) {
			TJS.Events.on('torrent:download', this.selectDownloadLocation, this);
			TJS.Events.on('torrent:remove', this.removeTorrent, this);
			TJS.Events.on('torrent:delete', this.deleteTorrent, this);
		},

		model: TJS.Models.Torrent,

		url: '/transmission?call=getAll',

		selectDownloadLocation: function (data) {

			var sources = TJS.xbmcVideoSources.attributes.sources,
				sourcesLength = sources.length,
				options = {
					message: "Where in XBMC would you like to save this download?",
					className: "download-modal",
					buttons: {}
				},
				me = this,
				i,
				getSelectCallabck = function (source) {
					return function () {
						me.addTorrent(data, source);
					};
				};

			options.message = "Where in XBMC would you like to save this download?";
			options.buttons = {};

			for (i=0; i < sourcesLength; i++) {
				options.buttons[sources[i].label] = {
					"callback": getSelectCallabck(sources[i].file),
					"className": "btn-block"
				};
			}

			options.buttons.cancel = {
				"label": "Cancel",
				"className": "btn-block btn-danger"
			};

			TJS.util.modal.dialog(options);

		},

		addTorrent: function (data, source) {
			$.ajax({
				url: "/transmission?call=addTorrent",
				data: {
					args: JSON.stringify({
						"filename": data.magnet,
						"download-dir": source
					})
				},
				success: function (data) {
					TJS.Events.trigger('torrent:update', data);
				},
				fail: function (data) {
					console.log(data);
				}
			});
		},

		removeTorrent: function (data) {

			TJS.util.modal.confirm("Are you sure?", function(result) {
				if (result) {
					$.ajax({
						url: "/transmission?call=removeTorrent",
						data: {
							args: JSON.stringify({
								ids: data.id
							})
						},
						success: function (data) {
							TJS.Events.trigger('torrent:update', data);
						},
						fail: function (data) {
							console.log(data);
						}
					});
				}

			}).css({
				width: '250px',
				'margin-left': function () {
					return -($(this).width() / 2);
				}
			});
		},

		deleteTorrent: function (data) {

			TJS.util.modal.confirm("Are you sure?", function(result) {
				if (result) {
					$.ajax({
						url: "/transmission?call=deleteTorrent",
						data: {
							args: JSON.stringify({
								ids: data.id
							})
						},
						success: function (data) {
							TJS.Events.trigger('torrent:update', data);
						},
						fail: function (data) {
							console.log(data);
						}
					});
				}

			}).css({
				width: '250px',
				'margin-left': function () {
					return -($(this).width() / 2);
				}
			});
		}
	});

}(TJS, $, _, Backbone));
