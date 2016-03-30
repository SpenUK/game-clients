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
			// test only? no need to allow pause in prod.
			$(document).on('keyup.controlModel', (function(e) {
				console.log('key', e.which);
				if (e.which === 80) {
					console.log('togglePause');
					e.preventDefault();
					ticker.togglePause();
				} else if (e.which === 81) /* q */ {
					e.preventDefault();
				} else if (e.which === 87) /* w */ {
					e.preventDefault();
				} else if (e.which === 69) /* e */ {
					e.preventDefault();
				} else if (e.which === 82) /* r */ {
					e.preventDefault();
				} else if (e.which === 82) /* r */ {
					e.preventDefault();
				} else if (e.which === 89) /* y */ {
					e.preventDefault();
				}
			}).bind(this));
			//
			// $(document).on('keydown.controlModel', (function(e) {
			//     this.onControlDown({message: e.which});
			//     e.preventDefault();
			// }).bind(this));

			// $(document).on('keyup.controlModel', (function(e) {
			//     this.onControlUp({message: e.which});
			//     e.preventDefault();
			// }).bind(this));
		},

		testOpenShop1: function () {
			this.socket.emit('game:entershop', {
				message: 'message'
			});
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