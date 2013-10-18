(function (TJS, $, _, Backbone, twig) {
	"use strict";

	TJS = TJS || {};
	TJS.Views = TJS.Views || {};

	TJS.Views.TorrentView = Backbone.View.extend({
		tagName: 'div',

		className: 'torrent row-fluid show-grid',

		template: twig({
			href: '/templates/torrent.twig',
			async: false
		}),

		events: {
			'click button.transmission': 'toggleDownload',
			'click button.remove': 'removeTorrent',
			'click button.delete': 'deleteTorrent'
		},

		render: function () {
			var data = this.model.toJSON();

			if (this.isPending()) {
				data.uploaded = 0;
				data.downloaded = 0;
			} else {
				data.uploaded = (data.uploadRatio > 0) ? parseInt(data.uploadRatio / data.seedRatioLimit * 100, 10) : 0;
				data.downloaded = parseInt(data.percentDone * 100, 10) - data.uploaded;
			}

			data = this.setStatusProperties(data);

			this.$el.html(this.template.render(data));
			return this;
		},

		setStatusProperties: function (data) {

			if (data.isFinished) {
				data.progress_type = 'progress progress-disabled';
				data.button_label = 'COMPLETE';
				data.remove_button_class = '';
				data.delete_button_class = '';
			} else if (this.isPending()) {
				data.progress_type = 'progress progress-disabled';
				data.button_label = 'PENDING';
				data.remove_button_class = '';
				data.delete_button_class = '';
			} else if (this.isStopped()) {
				data.progress_type = 'progress progress-disabled';
				data.button_label = 'START';
				data.remove_button_class = '';
				data.delete_button_class = '';
			} else {
				data.progress_type = 'progress';
				data.button_label = 'STOP';
				data.remove_button_class = 'hide';
				data.delete_button_class = 'hide';
			}
			return data;
		},

		toggleDownload: function () {
			if (this.isStopped()) {
				this.model.startDownload();
			} else {
				this.model.stopDownload();
			}
		},

		removeTorrent: function () {
			TJS.Events.trigger('torrent:remove', this.model.toJSON());
		},

		deleteTorrent: function () {
			TJS.Events.trigger('torrent:delete', this.model.toJSON());
		},

		isPending: function () {
			switch (this.model.toJSON().status) {
			case this.STATUS.TR_STATUS_CHECK_WAIT:
			case this.STATUS.TR_STATUS_CHECK:
			case this.STATUS.TR_STATUS_DOWNLOAD_WAIT:
				return true;
			default:
				return false;
			}
		},

		isStopped: function () {
			return (this.model.toJSON().status === this.STATUS.TR_STATUS_STOPPED);
		},

		STATUS: TJS.Config.Transmission.TORRENT_STATUS
	});

}(TJS, $, _, Backbone, twig));
