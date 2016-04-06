'use strict';

var _ = require('underscore'),
	ControlsView = require('./controls'),
	template = require('../templates/storeitemcontrols.hbs'),

	ControlsView = ControlsView.extend({

		template: template,

		acceptedParams: ['socket', 'controllerView'],

		// 189 = '-' / 187 = '+'\
		keysList: [37, 38, 39, 40, 65, 66],

		events: function () {
			return _.extend({}, this._super.apply(this, arguments), {
				'touchend .back-control': this.onBackPress,
				'touchend .buy-control': this.onBuyPress,
				'touchend .add': this.onAdd,
				'touchend .remove': this.onRemove,

				'click .back-control': this.onBackPress,
				'click .buy-control': this.onBuyPress,
				'click .add': this.onAdd,
				'click .remove': this.onRemove
			});
		},

		onBackPress: function () {
			this.model.set('controllerState', 'store');
		},

		onBuyPress: function () {
			// this.model.set('controllerState', 'itemStore');
			window.alert('buy');
		},

		onAdd: function () {
			window.alert('add');
		},

		onRemove: function () {
			window.alert('remove');
		}

	});

module.exports = ControlsView;
