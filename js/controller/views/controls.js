'use strict';

var _ = require('underscore'),
	ViewExtension = require('../../extensions/view'),
	// template = require('../templates/controls.hbs'),
	template = require('../templates/controls.hbs'),

	ControlsView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		events: function () {
			return {
				'touchstart .up': this.controlDown.bind(this, 38),
				'touchstart .down': this.controlDown.bind(this, 40),
				'touchstart .left': this.controlDown.bind(this, 37),
				'touchstart .right': this.controlDown.bind(this, 39),
				'touchstart .a-control': this.controlDown.bind(this, 65),
				'touchstart .b-control': this.controlDown.bind(this, 66),

				'touchend .up': this.controlUp.bind(this, 38),
				'touchend .down': this.controlUp.bind(this, 40),
				'touchend .left': this.controlUp.bind(this, 37),
				'touchend .right': this.controlUp.bind(this, 39),
				'touchend .a-control': this.controlUp.bind(this, 65),
				'touchend .b-control': this.controlUp.bind(this, 66),

				'mousedown .up': this.controlDown.bind(this, 38),
				'mousedown .down': this.controlDown.bind(this, 40),
				'mousedown .left': this.controlDown.bind(this, 37),
				'mousedown .right': this.controlDown.bind(this, 39),
				'mousedown .a-control': this.controlDown.bind(this, 65),
				'mousedown .b-control': this.controlDown.bind(this, 66),

				'click .up': this.controlUp.bind(this, 38),
				'click .down': this.controlUp.bind(this, 40),
				'click .left': this.controlUp.bind(this, 37),
				'click .right': this.controlUp.bind(this, 39),
				'click .a-control': this.controlUp.bind(this, 65),
				'click .b-control': this.controlUp.bind(this, 66)
			};
		},

		keysList: [37, 38, 39, 40, 65, 66],

		initialize: function() {
			this._super.apply(this, arguments);
			this.bindKeys();
		},

		render: function () {
			this._super.apply(this, arguments);
		},

		bindKeys: function () {
			$(document).on('keydown.controller', this.onClick.bind(this));
			$(document).on('keyup.controller', this.onRelease.bind(this));
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
