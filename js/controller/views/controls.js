'use strict';

var ViewExtension = require('../../extensions/view'),
	template = require('../templates/controls.hbs'),

	ControlsView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		events: {
			'click .up': 'upClick',
			'click .down': 'downClick',
			'click .left': 'leftClick',
			'click .right': 'rightClick'
		},

		initialize: function() {
			this._super.apply(this, arguments);
			console.log(this);
		},

		upClick: function () {
			console.log('upClick');
			this.socket.emit('control', 'up');
			this.model.trigger('control', 'up');
		},

		downClick: function () {
			console.log('downClick');
			this.socket.emit('control', 'down');
			this.model.trigger('control', 'down');
		},

		leftClick: function () {
			console.log('leftClick');
			this.socket.emit('control', 'left');
			this.model.trigger('control', 'left');
		},

		rightClick: function () {
			console.log('rightClick');
			this.socket.emit('control', 'right');
			this.model.trigger('control', 'right');
		}


	});

module.exports = ControlsView;
