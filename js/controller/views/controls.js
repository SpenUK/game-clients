'use strict';

var _ = require('underscore'),
	ViewExtension = require('../../extensions/view'),
	// template = require('../templates/controls.hbs'),
	template = require('../templates/controls.hbs'),

	ControlsView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		events: function () {
			var touch = document.ontouchstart !== null,
				startEvent = touch ? 'mousedown' : 'touchstart',
				endEvent = touch ? 'click' : 'touchend',
				events = {};


			events[startEvent + ' .up'] = this.controlDown.bind(this, 38);
			events[startEvent + ' .down'] = this.controlDown.bind(this, 40);
			events[startEvent + ' .left'] = this.controlDown.bind(this, 37);
			events[startEvent + ' .right'] = this.controlDown.bind(this, 39);
			events[startEvent + ' .a-control'] = this.controlDown.bind(this, 65);
			events[startEvent + ' .b-control'] = this.controlDown.bind(this, 66);

			events[endEvent + ' .up'] = this.controlUp.bind(this, 38);
			events[endEvent + ' .down'] = this.controlUp.bind(this, 40);
			events[endEvent + ' .left'] = this.controlUp.bind(this, 37);
			events[endEvent + ' .right'] = this.controlUp.bind(this, 39);
			events[endEvent + ' .a-control'] = this.controlUp.bind(this, 65);
			events[endEvent + ' .b-control'] = this.controlUp.bind(this, 66);

			return events;
		},

		keysList: [37, 38, 39, 40, 65, 66],

		initialize: function() {
			this._super.apply(this, arguments);
			this.bindKeys();
		},

		render: function () {
			// console.log('poop', arguments);
			this._super.apply(this, arguments);
		},

		bindKeys: function () {
			$(document).on('keydown.controller', this.onClick.bind(this));
			$(document).on('keyup.controller', this.onRelease.bind(this));
		},

		onRelease: function (e) {
			this.controlUp(e.which, e);
		},

		onClick: function (e) {
			this.controlDown(e.which, e);
		},

		controlUp: function (key) {
			// e.preventDefault();
			// console.log(e);
			if (_.contains(this.keysList, key)) {
				this.socket.emit('control:up', key);
				this.model.trigger('control:up', key);
			}
		},

		controlDown: function (key) {
			// e.preventDefault();
			// console.log(e);
			if (_.contains(this.keysList, key)) {
				this.socket.emit('control:down', key);
				this.model.trigger('control:down', key);
			}
		},

		remove: function() {
		    this.undelegateEvents();
		    this.$el.empty();
		    this.stopListening();
		    $(document).off('.controller');
		    return this;
		}
	});

module.exports = ControlsView;
