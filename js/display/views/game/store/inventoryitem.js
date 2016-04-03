'use strict';

var	View = require('../../../../extensions/view'),
	template = require('../../../templates/game/store/inventoryitem.hbs'),

	InventoryItemView = View.extend({

		template: template,

		tagName: 'li',

		className: 'inventory-item',

		acceptedParams: ['socket']

	});

module.exports = InventoryItemView;
