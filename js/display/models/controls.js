'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
	ModelExtension = require('../../extensions/model'),

    CameraModel = ModelExtension.extend({

    	acceptedParams: ['socket'],

    	keysBound: false,

    	initialize: function() {
    		this._super.apply(this, arguments);

    		this.socket.on('control press', this.onControlPress.bind(this));

    		this.bindKeys();
    	},

		bindKeys: function () {
			$(document).on('keydown.controlModel', (function(e) {
			    switch(e.which) {
			        case 37: // left
			        this.onControlPress({message: 'left'});
			        break;

			        case 38: // up
			        this.onControlPress({message: 'up'});
			        break;

			        case 39: // right
			        this.onControlPress({message: 'right'});
			        break;

			        case 40: // down
			        this.onControlPress({message: 'down'});
			        break;

			        default: return;
			    }
			    e.preventDefault(); // prevent the default action (scroll / move caret)
			}).bind(this));
		},

		onControlPress: function (data) {
			var message = data.message;
			if (_.contains(['up', 'down', 'right', 'left'], message)) {
				this.trigger('direction', message);
			}
		},

		remove: function () {
			$(document).off('keydown.controlModel');
			this._super.apply(this, arguments);
		},
    });

module.exports = CameraModel;