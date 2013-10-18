(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Views = TJS.Views || {};

	TJS.Views.TorrentsView = Backbone.View.extend({
		el: '#activeTorrents',

		initialize: function () {
			this.collection.bind('reset', this.render, this);
			TJS.Events.on('torrent:update', this.update, this);
			setInterval(_.bind(this.update, this), 60000);
		},

		render: function () {
			$("#activeTorrents").empty();
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function (torrent) {
			var torrentView = new TJS.Views.TorrentView({
					model: torrent
				});
			this.$el.append(torrentView.render().el);
		},

		update: function (data) {
			this.collection.fetch();
		}
	});

}(TJS, $, _, Backbone));
