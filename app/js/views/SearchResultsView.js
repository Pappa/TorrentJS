(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Views = TJS.Views || {};

	TJS.Views.SearchResultsView = Backbone.View.extend({
		el: '#searchResults',

		initialize: function () {
			this.collection.bind('reset', this.render, this);
			TJS.Events.on('torrent:search', this.update, this);
			TJS.Events.on('torrent:updateOnScrape', this.updateOnScrape, this);
		},

		render: function () {
			if (!this.collection.length) {
				this.noResults();
			} else {
				this.collection.each(this.addOne, this);
				TJS.Events.trigger('torrent:scrapeTorrents');
			}
			return this;
		},

		addOne: function (searchResult) {
			var searchResultView = new TJS.Views.SearchResultView({
				model: searchResult
			});
			this.$el.append(searchResultView.render().el);
		},

		noResults: function () {
			var noResultsView = new TJS.Views.NoResultsView({});
			this.$el.append(noResultsView.render().el);
		},

		update: function (q) {
			$("#searchResultsTitle").show();
			$("#searchResults").show();
			$("#searchResults").empty();
			this.collection.setQuery(q);
			this.collection.fetch();
			Backbone.history.navigate("#searchResults", true);
		},

		updateOnScrape: function (data) {
			this.collection.each(
				function (model) {
					var id = model.get('id');
					model.set({
						seeders: data[id].seeders,
						leechers: data[id].leechers
					});
					$(this.el).find('#' + id + ' .seeders').html(model.get('seeders'));
					$(this.el).find('#' + id + ' .leechers').html(model.get('leechers'));

				}, this);
		}
	});

}(TJS, $, _, Backbone));
