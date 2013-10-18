var TJS = TJS || {};

(function (TJS, $, _, Backbone) {
	"use strict";

	TJS.load = function () {

		// torrents
		TJS.torrents = new TJS.Collections.Torrents();
		TJS.torrents.fetch();

		TJS.torrentsView = new TJS.Views.TorrentsView({
			collection: TJS.torrents
		});

		$("#activeTorrents").append(TJS.torrentsView.render().el);

		// search results
		TJS.searchResults = new TJS.Collections.SearchResults([]);

		TJS.searchResultsView = new TJS.Views.SearchResultsView({
			collection: TJS.searchResults
		});

		$("#searchResults").append(TJS.searchResultsView.render().el);

		// search form
		TJS.searchFormView = new TJS.Views.SearchFormView({ collection: TJS.searchResults });

		// settings
		TJS.settings = new TJS.Models.Settings();
		TJS.settings.fetch();

		TJS.settingsView = new TJS.Views.SettingsView({
			model: TJS.settings
		});

		// xbmc sources
		TJS.xbmcVideoSources = new TJS.Models.XbmcVideoSources();
		TJS.xbmcVideoSources.fetch();

		// router
		TJS.router = new TJS.Router();
		Backbone.history.start();


	};

}(TJS, $, _, Backbone));