'use strict';
/*jshint bitwise: false*/

var ModelExtension = require('../../extensions/model'),
	MapsCollection = require('../collections/maps'),

    GameModel = ModelExtension.extend({
    	// need to actually set these defaults.
		defaults: {
			height: 0,
			width: 0,
			deadzone: {
				x: 0,
				y: 0
			}
		},

		initialize: function() {
			var mapData = window.initialData.map;

			this._super.apply(this, arguments);

			this.mapsCollection = new MapsCollection(mapData.maps, {
				defaultMap: mapData.defaultMap
			});
		},

		getCurrentMap: function () {
			return this.mapsCollection.getCurrentMap();
		}
    });

module.exports = GameModel;