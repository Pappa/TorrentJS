(function (TJS, $, _, Backbone, twig) {
	"use strict";

	TJS = TJS || {};
	TJS.Views = TJS.Views || {};

	TJS.Views.SearchResultView = Backbone.View.extend({

		initialize: function () {
		},

		tagName: 'div',

		className: 'searchResult row-fluid show-grid',

		template: twig({
			href: '/templates/searchResult.twig',
			async: false
		}),

		events: {
			'click button.download': 'downloadTorent'
		},

		render: function () {
			this.$el.html(this.template.render(this.model.toJSON()));
			return this;
		},

		downloadTorent: function () {
			TJS.Events.trigger('torrent:download', this.model.toJSON());
		}
	});

}(TJS, $, _, Backbone, twig));
