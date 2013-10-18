(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Models = TJS.Models || {};

	TJS.Models.Settings = Backbone.Model.extend({
		defaults: {
			name: "Settings"
		},

		url: '/settings'
	});

}(TJS, $, _, Backbone));
