'use strict';
/*jshint bitwise: false*/

var ModelExtension = require('../../extensions/model'),
	// MapsCollection = require('../collections/maps'),
	MapsCollection = require('../collections/mapss'),
	EntitiesCollection = require('../collections/entities'),
	// NpcModel = require('./npc'),
	// TilesetsCollection = require('../collections/tilesets'),
	PlayerModel = require('./playerr'),
	ticker = require('../ticker'),

    GameModel = ModelExtension.extend({

    	acceptedParams: ['socket', 'cameraModel'],

		isReady: false,

		ticker: ticker.initialize(),

		initialize: function() {
			var playerData = window.initialData.player,
				mapData = window.initialData.map;

			this.playerModel = new PlayerModel(playerData, {
				gameModel: this.model,
				controlsModel: this.controlsModel,
				socket: this.socket
			});

			this.set('playerModel', this.playerModel);

			this.entities = new EntitiesCollection();

			this.entities.add(this.playerModel);

			this.mapsCollection = new MapsCollection(mapData.tiledMaps, {
				defaultMap: mapData.defaultMap
			});

			this.set('controllerUrl', 'bit.ly/rpg-control');

			this.socket.on('token generated', this.setToken.bind(this));

			this.socket.emit('display initialize');
			this.socket.emit('request token');

			this._super.apply(this, arguments);

			this.on('change:token', this.setUrl);

			window.gameModel = this;
		},

		tick: function () {
			var currentMap = this.mapsCollection.getCurrentMap();
			currentMap.draw();
			this.entities.drawEach();
		},

		setToken: function (data) {
			this.set('token', data.token);
		},

		setUrl: function () {
			var url = window.location.origin + '/controller/' + this.get('token');
			this.set('url', url);
		},

		getCurrentMap: function () {
			return this.mapsCollection.getCurrentMap();
		}
    });

module.exports = GameModel;