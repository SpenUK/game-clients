'use strict';

var	ViewExtension = require('../../../extensions/view'),
	EnvironmentView = require('./environment'),
	PlayerView = require('./player'),
	CameraModel = require('../../models/camera'),
	ControlsModel = require('../../models/controls'),
	PlayerModel = require('../../models/player'),
	template = require('../../templates/game/game.hbs'),

	GameView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		width: 600,

		height: 400,

		initialize: function() {
			var playerData = window.initialData.player,
				width = this.model.get('width'),
				height = this.model.get('height');

			this._super.apply(this, arguments);

			this.controlsModel = new ControlsModel({}, {
				socket: this.socket
			});
			this.model.set('controlsModel', this.controlsModel);

			this.playerModel = new PlayerModel(playerData, {
				gameModel: this.model,
				controlsModel: this.controlsModel,
				socket: this.socket
			});

			this.model.set('playerModel', this.playerModel);

			this.cameraModel = new CameraModel({
				deadzone: {
					x: width / 2,
					y: height / 2
				}
			}, {
				playerModel: this.playerModel,
				gameModel: this.model,
				width: width,
				height: height,
				deadzone: {
					x: width / 2,
					y: height / 2
				}
			});
			this.model.set('cameraModel', this.cameraModel);

			// this.socket.on('controller joined', this.onControllerJoined.bind(this));

		},

		views: function () {
			return {
				'.environment': {
					view: EnvironmentView,
					options: {
						socket: this.socket,
						cameraModel: this.cameraModel
					}
				},

				'.player': {
					view: PlayerView,
					options: {
						socket: this.socket,
						cameraModel: this.cameraModel,
						gameModel: this.model,
						model: this.playerModel
					}
				}
			};
		}

	});

module.exports = GameView;
