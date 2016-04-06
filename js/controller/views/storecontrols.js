'use strict';

// var _ = require('underscore'),
var	Collection = require('../../extensions/collection'),
	ControlsView = require('./controls'),
	template = require('../templates/storecontrols.hbs'),

	ControlsView = ControlsView.extend({

		template: template,

		acceptedParams: ['socket', 'controllerView', 'parentView'],

		// 189 = '-' / 187 = '+'\
		keysList: [37, 38, 39, 40, 65, 66],

		initialize: function() {
			var itemsCollection = this.getItemsCollection();
			this._super.apply(this, arguments);

			this.listenTo(itemsCollection, 'updatedCurrent', this.render);

		},

		getItemsCollection: function () {
			return this.model.get('itemsCollection') || this.setItemsCollection.apply(this, arguments);
		},

		setItemsCollection: function () {
			var itemsCollection = new Collection(this.model.get('inventory'));

			this.model.set('itemsCollection', itemsCollection);

			return itemsCollection;
		},

		events: function () {
			var touch = document.ontouchstart !== null,
				// startEvent = touch ? 'mousedown' : 'touchstart',
				endEvent = touch ? 'click' : 'touchend',
				events = this._super.apply(this, arguments);

				events[endEvent + ' .prev'] = this.onPrev;
				events[endEvent + ' .next'] = this.onNext;
				events[endEvent + ' .back-control'] = this.onBackPress;
				events[endEvent + ' .select-control'] = this.onSelectPress;

			return events;
		},

		onBackPress: function () {
			this.parentView.goBack();
			this.controlUp(66);
		},

		onSelectPress: function () {
			var itemsCollection = this.getItemsCollection(),
				currentItem = itemsCollection.at(itemsCollection.position);

			this.parentView.showStoreItem(currentItem);
		},

		onNext: function () {
			this.getItemsCollection().incrementPosition();
		},

		onPrev: function () {
			this.getItemsCollection().decrementPosition();
		},

		serialize: function () {
			var itemsCollection = this.getItemsCollection(),
				currentItem = itemsCollection.at(itemsCollection.position);

			return {
				name: currentItem.get('name'),
				price: currentItem.get('price'),
				src: currentItem.get('src')
			};
		}

	});

module.exports = ControlsView;
