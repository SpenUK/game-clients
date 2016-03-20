'use strict';
/*jshint bitwise: false*/

var ModelExtension = require('../../extensions/model'),
	// MapsCollection = require('../collections/maps'),
	TiledMapCollection = require('../collections/mapss'),
	// TilesetsCollection = require('../collections/tilesets'),
	ticker = require('../ticker'),

    GameModel = ModelExtension.extend({

    	acceptedParams: ['socket'],

    	// need to actually set these defaults.
		defaults: {
			height: 0,
			width: 0,
			deadzone: {
				x: 0,
				y: 0
			}
		},

		ticker: ticker.initialize(),

		initialize: function() {
			var mapData = window.initialData.map;

			this.tiledMapsCollection = new TiledMapCollection(mapData.tiledMaps, {
				defaultMap: mapData.defaultMap
			});

			this.set('controllerUrl', 'bit.ly/rpg-control');

			this.socket.on('token generated', this.setToken.bind(this));

			this.socket.emit('display initialize');
			this.socket.emit('request token');

			this._super.apply(this, arguments);

			// this.mapsCollection = new MapsCollection(mapData.maps, {
			// 	defaultMap: mapData.defaultMap
			// });

			this.on('change:token', this.setUrl);
		},

		setToken: function (data) {
			this.set('token', data.token);
		},

		setUrl: function () {
			var url = window.location.origin + '/controller/' + this.get('token');
			this.set('url', url);
		},

		getCurrentMap: function () {
			return this.tiledMapsCollection.getCurrentMap();
		}
    });

module.exports = GameModel;