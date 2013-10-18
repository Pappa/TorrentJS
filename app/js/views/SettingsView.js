(function (TJS, $, _, Backbone, twig) {
	"use strict";

	TJS = TJS || {};
	TJS.Views = TJS.Views || {};

	TJS.Views.SettingsView = Backbone.View.extend({

		initialize: function () {
			TJS.Events.on('settings:load', this.loadSettings, this);
			TJS.Events.on('settings:parse:error', this.parseError, this);
		},

		template: twig({
			href: '/templates/settings.twig',
			async: false
		}),

		updateModel: function () {
			var inputs = $("#settingsForm").find("input");
			inputs.each(function(i) {
				TJS.settings.set($(this).attr("id"), $(this).val());
			});
			TJS.settings.save({}, {
				error: function (model, jqXHR) {
					TJS.Events.trigger('settings:parse:error');
				},
				timeout: 15000
			});
		},

		loadSettings: function (e) {
			var options = {},
				me = this;

			options.message = this.template.render(this.model.toJSON());
			options.buttons = {};

			options.buttons.Cancel = {
				"label": "Cancel"
			};

			options.buttons.Submit = {
				"label": "Submit",
				"callback": me.updateModel
			};

			TJS.util.modal.dialog(options);
		},

		parseError: function (e) {
			var options = {},
				me = this;

			options.message = "There was an error saving your settings.";
			options.buttons = {};

			options.buttons.Close = {
				"label": "Close"
			};

			TJS.util.modal.dialog(options);
		}
	});

}(TJS, $, _, Backbone, twig));
