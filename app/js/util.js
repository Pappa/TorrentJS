(function (TJS, $, _, bootbox) {
	"use strict";


	TJS = TJS || {};
	TJS.util = TJS.util || {};

	TJS.util.template = function (id) {
		return _.template($('#' + id).html());
	};

	TJS.util.modal = bootbox;

}(TJS, $, _, bootbox));