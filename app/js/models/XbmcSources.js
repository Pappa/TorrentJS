(function (TJS, $, _, Backbone) {
	"use strict";

	TJS = TJS || {};
	TJS.Models = TJS.Models || {};

	TJS.Models.XbmcVideoSources = Backbone.Model.extend({
		defaults: {
			name: "XbmcSources"
		},

		url: '/xbmc?call=getVideoSources'
	});

}(TJS, $, _, Backbone));
