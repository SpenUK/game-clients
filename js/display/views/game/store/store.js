'use strict';

var	View = require('../../../../extensions/view'),
	Collection = require('../../../../extensions/collection'),
	InventoryView = require('./inventory'),
	template = require('../../../templates/game/store/store.hbs'),

	GameUIView = View.extend({

		template: template,

		acceptedParams: ['socket'],

		views: function () {
			return {
				'.inventory': {
					view: InventoryView,
					options: {
						collection: new Collection(this.model.get('inventory'))
					}
				}
			};
		},

		remove: function() {
			// could be a better way that overriding remove right?
		    this.$el.empty().off();
		    this.stopListening();
			return this;
		}

	});

module.exports = GameUIView;
