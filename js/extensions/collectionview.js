'use strict';

var _ = require('underscore'),
	core = require('../core/core'),

	/**
	 *
	 */
	CollectionView = core.CollectionView.extend({

		initialize: function() {

			this._super.apply(this, arguments);

			// handle render some other way??
			if (!_.result(this.collection, 'isReady') || !this.collection.length) {
				this.listenToOnce(this.collection, 'ready', function(){
					this.render();
				});
			} else {
				this.render();
			}
		}

	});

module.exports = CollectionView;