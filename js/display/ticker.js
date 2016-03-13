'use strict';

var _ = require('underscore');

	module.exports = {

		paused: true,

		initialize: function() {
			this.callbacks = {};
			this.unpause();
			this.tick();

			return this;
		},

		register: function (id, method, context) {
			console.log('register');
			if (!this.callbacks[id]) {
				this.callbacks[id] = {
					method: method,
					context: context
				};
			} else {
				console.log('already registered');
			}
		},

		remove: function (id) {
			if (this.callbacks[id]) {
				this.callbacks[id] = null;
			} else {
				console.log('not registered');
			}
		},

		pause: function () {
			this.paused = true;
		},

		unpause: function () {
			this.paused = false;
		},

		togglePause: function () {
			(this.paused ? this.pause : this.unpause)();
		},

		tick: function () {
			_.each(this.callbacks, function(callback) {
				if (callback.context) {
					callback.method.bind(callback.context);
				}
				callback.method();
			});

			if (!this.paused) {
				window.requestAnimationFrame(this.tick.bind(this));
			}
		}
	};

	// console.log(ticker);

// module.exports = ticker;