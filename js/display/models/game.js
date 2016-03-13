'use strict';
/*jshint bitwise: false*/

var ModelExtension = require('../../extensions/model'),
	MapsCollection = require('../collections/maps'),
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

			this.socket.on('token generated', this.setUrl.bind(this));

			this.socket.emit('display initialize');
			this.socket.emit('request token');

			this._super.apply(this, arguments);

			this.mapsCollection = new MapsCollection(mapData.maps, {
				defaultMap: mapData.defaultMap
			});
		},

		setUrl: function (data) {
			var url = window.location.origin + '/controller/' + data.token;
			this.set('url', url);
		},

		getCurrentMap: function () {
			return this.mapsCollection.getCurrentMap();
		}
    });

module.exports = GameModel;