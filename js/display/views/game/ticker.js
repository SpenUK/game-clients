'use strict';

var _ = require('underscore'),

	ticker = {

		callbacks: [],

		// register: function (method, context) {
			// if (!this.callbacks.indexOf(method)) {
			// 	this.callbacks.push({
			// 		method: method,
			// 		context: context
			// 	});
			// } else {
			// 	console.log('already registered');
			// }
		// },

		start: function () {
			if (this.callbacks.length) {
				this.tick();
			}
		},

		tick: function () {
			_.each(this.callbacks, function() {

			});
		}
	};


module.exports = ticker;