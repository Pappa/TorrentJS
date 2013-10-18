(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Views = TJS.Views || {};

	TJS.Views.SearchFormView = Backbone.View.extend({
		el: '#searchForm',

		events: {
			"click #settings": "loadSettings",
			"submit": "doSearch"
		},

		doSearch: function (e) {
			e.preventDefault();
			var q = this.$el.find('#searchInput').val();
			TJS.Events.trigger('torrent:search', q);
		},

		loadSettings: function (e) {
			e.preventDefault();
			TJS.Events.trigger('settings:load');
		}
	});

}(TJS, $, _, Backbone));
