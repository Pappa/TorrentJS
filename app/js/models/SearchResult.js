(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Models = TJS.Models || {};

	TJS.Models.SearchResult = Backbone.Model.extend({
		defaults: {
			title: "Search Result"
		}
	});

}(TJS, $, _, Backbone));
