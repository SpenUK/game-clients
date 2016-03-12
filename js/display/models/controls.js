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
			    // switch(e.which) {
			    //     case 37: // left
			    //     this.onControlDown({message: 'left'});
			    //     break;

			    //     case 38: // up
			    //     this.onControlDown({message: 'up'});
			    //     break;

			    //     case 39: // right
			    //     this.onControlDown({message: 'right'});
			    //     break;

			    //     case 40: // down
			    //     this.onControlDown({message: 'down'});
			    //     break;

			    //     default: return;
			    // }
			    this.onControlDown({message: e.which});
			    e.preventDefault();
			}).bind(this));

			$(document).on('keyup.controlModel', (function(e) {
			    // switch(e.which) {
			    //     case 37: // left
			    //     this.onControlUp({message: 'left'});
			    //     break;

			    //     case 38: // up
			    //     this.onControlUp({message: 'up'});
			    //     break;

			    //     case 39: // right
			    //     this.onControlUp({message: 'right'});
			    //     break;

			    //     case 40: // down
			    //     this.onControlUp({message: 'down'});
			    //     break;

			    //     default: return;
			    // }
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