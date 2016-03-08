'use strict';

var core = require('../core/core'),
	template = require('./templates/timeout.hbs'),

	TimeoutView = core.View.extend({

		template: template,

		acceptedParams: ['retryFunction', 'icon', 'iconSize', 'notice'],

		retryFunction: function(){},

		icon: 'exclamation-circle',

		iconSize: '4x',

		notice: 'Something went wrong',

		showTimeout: function () {
			return this.$el.html(this.timeoutTemplate());
		},

		events: {
			'click': 'retryFunction'
		},

		serialize: function () {
			return {
				icon: this.icon,
				iconSize: this.iconSize,
				notice: this.notice
			};
		}

	});

module.exports = TimeoutView;