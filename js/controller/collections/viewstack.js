'use strict';

var Collection = require('../../extensions/collection'),

	ViewStackCollection = Collection.extend({

		initialize: function() {
			this._super.apply(this, arguments);
		}

	});

module.exports = ViewStackCollection;
