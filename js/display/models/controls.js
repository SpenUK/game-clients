'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
	ModelExtension = require('../../extensions/model'),

    CameraModel = ModelExtension.extend({

    	acceptedParams: ['socket'],

    	keysBound: false,

    	keysList: [37, 38, 39, 40],

    	initialize: function() {
    		this._super.apply(this, arguments);

    		this.socket.on('control down', this.onControlDown.bind(this));
    		this.socket.on('control up', this.onControlUp.bind(this));

    		this.bindKeys();
    	},

		bindKeys: function () {
			$(document).on('keydown.controlModel', (function(e) {
			    this.onControlDown({message: e.which});
			    e.preventDefault();
			}).bind(this));

			$(document).on('keyup.controlModel', (function(e) {
			    this.onControlUp({message: e.which});
			    e.preventDefault();
			}).bind(this));
		},

		onControlDown: function (data) {
			var message = data.message;
			console.log('pressed:', message);
			if (_.contains(this.keysList, message)) {
				this.trigger('down', message);
			}
		},

		onControlUp: function (data) {
			var message = data.message;
			console.log('released:', message);
			if (_.contains(this.keysList, message)) {
				this.trigger('up', message);
			}
		},

		remove: function () {
			$(document).off('.controlModel');
			this._super.apply(this, arguments);
		},
    });

module.exports = CameraModel;