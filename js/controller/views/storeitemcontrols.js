'use strict';

// var _ = require('underscore'),
var Model = require('../../extensions/model'),
	ControlsView = require('./controls'),
	template = require('../templates/storeitemcontrols.hbs'),

	ControlsView = ControlsView.extend({

		template: template,

		acceptedParams: ['socket', 'controllerView', 'parentView'],

		// 189 = '-' / 187 = '+'\
		keysList: [37, 38, 39, 40, 65, 66],

		initialize: function() {
			this._super.apply(this, arguments);
			console.log(this.model);

			this.purchaseModel = new Model({
				quantity: 0,
				total: 0
			});
		},

		events: function () {
			var touch = document.ontouchstart !== null,
				// startEvent = touch ? 'mousedown' : 'touchstart',
				endEvent = touch ? 'click' : 'touchend',
				events = this._super.apply(this, arguments);

			events[endEvent + ' .back-control'] = this.onBackPress;
			events[endEvent + ' .buy-control'] = this.onBuyPress;
			events[endEvent + ' .add'] = this.onAdd;
			events[endEvent + ' .remove'] = this.onSubtract;

			return events;
		},

		getPurchaseDetails: function () {
			return {
				itemId: this.model.get('itemId'),
				quantity: this.purchaseModel.get('quantity')
			};
		},

		onBackPress: function () {
			this.parentView.goBack();
		},

		onBuyPress: function () {
			var details = this.getPurchaseDetails();
			this.socket.emit('purchase-item', details);
		},

		onAdd: function () {
			var quantity = this.purchaseModel.get('quantity'),
				price = this.model.get('price'),
				cappedQuantity = Math.min(Math.max(quantity + 1, 0), 99),
				total = cappedQuantity * price;


			this.purchaseModel.set({
				quantity: cappedQuantity,
				total: total
			});

			this.render();
		},

		onSubtract: function () {
			var quantity = this.purchaseModel.get('quantity'),
				price = this.model.get('price'),
				cappedQuantity = Math.min(Math.max(quantity - 1, 0), 99),
				total = cappedQuantity * price;

			this.purchaseModel.set({
				quantity: cappedQuantity,
				total: total
			});

			this.render();
		},

		serialize: function () {
			return {
				name: this.model.get('name'),
				price: this.model.get('price'),
				quantity: this.purchaseModel.get('quantity'),
				total: this.purchaseModel.get('total')
			};
		}

	});

module.exports = ControlsView;
