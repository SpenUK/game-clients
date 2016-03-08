'use strict';

var core = require('../core/core'),
	TimeoutView = require('./timeoutview'),
	loaderTemplate = require('./templates/loaderview.hbs'),

	LoaderView = core.View.extend({

		loaderTemplate: loaderTemplate,

		timeoutPeriod: 10000,

		showLoader: function () {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(this.onTimeout, this.timeoutPeriod);

			this.trigger('showLoader');
			return this.$el.html(this.loaderTemplate());
		},

		onTimeout: function () {
			var timeoutView = new TimeoutView({
				el: this.el,
				$el: this.$el
			});

			timeoutView.render();
		},

		retry: function () {
		},

		render: function () {
			clearTimeout(this.timeout);
			this._super.apply(this, arguments);
		},

	});

module.exports = LoaderView;