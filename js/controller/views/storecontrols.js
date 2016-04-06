'use strict';

var _ = require('underscore'),
	ControlsView = require('./controls'),
	template = require('../templates/storecontrols.hbs'),

	ControlsView = ControlsView.extend({

		template: template,

		acceptedParams: ['socket', 'controllerView'],

		// 189 = '-' / 187 = '+'\
		keysList: [37, 38, 39, 40, 65, 66],

		events: function () {
			return _.extend({}, this._super.apply(this, arguments), {
				'touchend .back-control': this.onBackPress,
				'touchend .select-control': this.onSelectPress,

				'click .back-control': this.onBackPress,
				'click .select-control': this.onSelectPress
			});
		},

		onBackPress: function () {
			this.controlUp(66);
			this.model.unset('controllerState');
		},

		onSelectPress: function () {
			this.model.set('controllerState', 'storeItem');
		}

	});

module.exports = ControlsView;
