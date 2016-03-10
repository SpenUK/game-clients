'use strict';

var ViewExtension = require('../../extensions/view'),
	template = require('../templates/controls.hbs'),

	ControlsView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		events: {
			'click .up': 'up',
			'click .down': 'down',
			'click .left': 'left',
			'click .right': 'right'
		},

		initialize: function() {
			this._super.apply(this, arguments);
			this.bindKeys();
		},

		bindKeys: function () {
			var controller = this;
			$(document).keydown(function(e) {
			    switch(e.which) {
			        case 37: // left
			        controller.left();
			        break;

			        case 38: // up
			        controller.up();
			        break;

			        case 39: // right
			        controller.right();
			        break;

			        case 40: // down
			        controller.down();
			        break;

			        default: return;
			    }
			    e.preventDefault(); // prevent the default action (scroll / move caret)
			});
		},

		up: function () {
			console.log('upClick');
			this.socket.emit('control', 'up');
			this.model.trigger('control', 'up');
		},

		down: function () {
			console.log('downClick');
			this.socket.emit('control', 'down');
			this.model.trigger('control', 'down');
		},

		left: function () {
			console.log('leftClick');
			this.socket.emit('control', 'left');
			this.model.trigger('control', 'left');
		},

		right: function () {
			console.log('rightClick');
			this.socket.emit('control', 'right');
			this.model.trigger('control', 'right');
		}


	});

module.exports = ControlsView;
