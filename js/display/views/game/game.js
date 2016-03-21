'use strict';

var	ViewExtension = require('../../../extensions/view'),
	// EnvironmentView = require('./environmentt'),
	// PlayerView = require('./player'),
	// CameraModel = require('../../models/camera'),
	ControlsModel = require('../../models/controls'),
	// PlayerModel = require('../../models/playerr'),
	template = require('../../templates/game/game.hbs'),

	GameView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		isReady: false,

		initialize: function() {
			this._super.apply(this, arguments);

			this.controlsModel = new ControlsModel({}, {
				socket: this.socket
			});

			this.model.set('controlsModel', this.controlsModel);

			if (this.model.isReady) {
				this.ready();
			} else {
			 	this.listenToOnce(this.model, 'ready', this.ready);
			}

			// this.playerModel = new PlayerModel(playerData, {
			// 	gameModel: this.model,
			// 	controlsModel: this.controlsModel,
			// 	socket: this.socket
			// });

			// this.mapsCollection = new MapsCollection(mapsData);

			// this.cameraModel = new CameraModel({
			// 	deadzone: {
			// 		x: width / 2,
			// 		y: height / 2
			// 	}
			// }, {
			// 	// playerModel: this.playerModel,
			// 	gameModel: this.model,
			// 	width: width,
			// 	height: height,
			// 	deadzone: {
			// 		x: width / 2,
			// 		y: height / 2
			// 	}
			// });

			// this.playerModel = new PlayerModel(playerData, {
			// 	gameModel: this.model,
			// 	cameraModel: this.cameraModel,
			// 	controlsModel: this.controlsModel,
			// 	socket: this.socket
			// });




			// this.model.set('cameraModel', this.cameraModel);

			// this.environmentView = new EnvironmentView({
			// 	socket: this.socket,
			// 	cameraModel: this.cameraModel
			// });

			// this.socket.on('controller joined', this.onControllerJoined.bind(this));

		},

		render: function () {
			this._super.apply(this, arguments);
			this.model.ticker.register('game-tick', this.tick.bind(this));
		},

		tick: function () {
			this.model.tick();
		},

		serialize: function () {
			return {
				gameWidth: this.width + 'px',
				gameHeight: this.height + 'px'
			};
		}

	});

module.exports = GameView;
