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
			'touchstart .a-control': 'mdA',
			'touchstart .b-control': 'mdB',

			'touchend .up': 'muUp',
			'touchend .down': 'muDown',
			'touchend .left': 'muLeft',
			'touchend .right': 'muRight',
			'touchend .a-control': 'muA',
			'touchend .b-control': 'muB',

			'mousedown .up': 'mdUp',
			'mousedown .down': 'mdDown',
			'mousedown .left': 'mdLeft',
			'mousedown .right': 'mdRight',
			'mousedown .a-control': 'mdA',
			'mousedown .b-control': 'mdB',

			'click .up': 'muUp',
			'click .down': 'muDown',
			'click .left': 'muLeft',
			'click .right': 'muRight',
			'click .a-control': 'muA',
			'click .b-control': 'muB'
		},

		keysList: [37, 38, 39, 40, 65, 66],

		initialize: function() {
			this._super.apply(this, arguments);
			this.bindKeys();
		},

		bindKeys: function () {
			console.log('bindKeys');
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

		mdA: function () {
			this.controlDown(65);
		},

		mdB: function () {
			this.controlDown(66);
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

		muA: function () {
			this.controlUp(65);
		},

		muB: function () {
			this.controlUp(66);
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
