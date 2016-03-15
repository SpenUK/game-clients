'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
	ModelExtension = require('../../extensions/model'),
	ticker = require('../ticker'),

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
			if (_.contains(this.keysList, data.message)) {
				this.trigger('down', data.message);
			}
		},

		onControlUp: function (data) {
			if (data.message === 80) {
				ticker.togglePause();
			}

			if (_.contains(this.keysList, data.message)) {
				this.trigger('up', data.message);
			}
		},

		remove: function () {
			$(document).off('.controlModel');
			this._super.apply(this, arguments);
		},
    });

module.exports = CameraModel;