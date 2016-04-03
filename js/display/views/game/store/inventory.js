'use strict';

var	CollectionView = require('../../../../extensions/collectionview'),
	// Model = require('../../../extensions/model'),
	InventoryItem = require('./inventoryitem'),
	template = require('../../../templates/game/store/inventory.hbs'),

	InventoryView = CollectionView.extend({

		template: template,

		acceptedParams: ['socket'],

		itemView: InventoryItem

	});

module.exports = InventoryView;
