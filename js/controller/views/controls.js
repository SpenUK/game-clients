'use strict';

var _ = require('underscore'),
	ViewExtension = require('../../extensions/view'),
	template = require('../templates/controls.hbs'),

	ControlsView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		events: {
			'touchstart .up': 'mdUp',
			'touchstart .down': 'mdDown',
			'touchstart .left': 'mdLeft',
			'touchstart .right': 'mdRight',

			'touchend .up': 'muUp',
			'touchend .down': 'muDown',
			'touchend .left': 'muLeft',
			'touchend .right': 'muRight',

			'mousedown .up': 'mdUp',
			'mousedown .down': 'mdDown',
			'mousedown .left': 'mdLeft',
			'mousedown .right': 'mdRight',

			'click .up': 'muUp',
			'click .down': 'muDown',
			'click .left': 'muLeft',
			'click .right': 'muRight'
		},

		keysList: [37, 38, 39, 40],

		initialize: function() {
			this._super.apply(this, arguments);
			this.bindKeys();
		},

		bindKeys: function () {
			$(document).on('keydown.controller', this.onClick.bind(this));
			$(document).on('keyup.controller', this.onRelease.bind(this));
		},

		// TODO: do better.
		mdUp: function () {
			this.controlDown(38);
		},

		mdDown: function () {
			this.controlDown(40);
		},

		mdLeft: function () {
			this.controlDown(37);
		},

		mdRight: function () {
			this.controlDown(39);
		},

		muUp: function () {
			this.controlUp(38);
		},

		muDown: function () {
			this.controlUp(40);
		},

		muLeft: function () {
			this.controlUp(37);
		},

		muRight: function () {
			this.controlUp(39);
		},

		onRelease: function (e) {
			this.controlUp(e.which);
		},

		onClick: function (e) {
			this.controlDown(e.which);
		},

		controlUp: function (key) {
			if (_.contains(this.keysList, key)) {
				this.socket.emit('control:up', key);
				this.model.trigger('control:up', key);
			}
		},

		controlDown: function (key) {
			if (_.contains(this.keysList, key)) {
				this.socket.emit('control:down', key);
				this.model.trigger('control:down', key);
			}
		},

		remove: function () {
			this._super.apply(this, arguments);
			$(document).off('.controller');
		}
	});

module.exports = ControlsView;
