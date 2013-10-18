(function (TJS, $, _, Backbone, twig) {
	"use strict";

	TJS = TJS || {};
	TJS.Views = TJS.Views || {};

	TJS.Views.NoResultsView = Backbone.View.extend({

		initialize: function () {
		},

		tagName: 'div',

		className: 'noResults row-fluid show-grid',

		template: twig({
			href: '/templates/noResults.twig',
			async: false
		}),

		render: function () {
			this.$el.html(this.template.render());
			return this;
		}
	});

}(TJS, $, _, Backbone, twig));
