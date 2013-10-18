(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Collections = TJS.Collections || {};

	TJS.Collections.SearchResults = Backbone.Collection.extend({
		model: TJS.Models.SearchResult,
		initialize: function () {
			TJS.Events.on('torrent:scrapeTorrents', this.scrapeTorrents, this);
		},
		url: function () {
			return "/search?q=" + this.query;
		},
		setQuery: function (q) {
			this.query = q;
		},
		getInfoHashes: function () {
			var hashArray = [];
			this.each(function(model) {
				hashArray.push(model.get('id'));
			});
			return hashArray;
		},
		scrapeTorrents: function () {
			$.ajax({
				url: "/scrape",
				data: {
					info_hashes: this.getInfoHashes()
				},
				success: function (data) {
					TJS.Events.trigger('torrent:updateOnScrape', data);
				}
			});

		}
	});

}(TJS, $, _, Backbone));
