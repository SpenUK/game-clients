'use strict';

var _ = require('underscore');

module.exports = {

	initialized: false,

	paused: true,

	initialize: function() {
		_.bindAll(this, 'register', 'remove', 'pause', 'unpause', 'togglePause', 'tick');

		this.callbacks = {};
		this.initialized = true;
		this.tick();

		return this;
	},

	register: function (id, method, context) {
		if (!this.callbacks[id]) {
			this.callbacks[id] = {
				method: method,
				context: context
			};
		}
	},

	remove: function (id) {
		if (this.callbacks[id]) {
			this.callbacks[id] = null;
		}
	},

	pause: function () {
		this.paused = true;
	},

	unpause: function () {
		if (this.paused) {
			this.paused = false;
			window.requestAnimationFrame(this.tick.bind(this));
		}
	},

	togglePause: function () {
		(this.paused ? this.unpause : this.pause)();
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