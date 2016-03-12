'use strict';

var _ = require('underscore'),
	ViewExtension = require('../../../extensions/view'),
	EnvironmentView = require('./environment'),
	PlayerView = require('./player'),
	CameraModel = require('../../models/camera'),
	ControlsModel = require('../../models/controls'),
	PlayerModel = require('../../models/player'),
	// FrameLoop = require('../../../frameLoop'),
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
				controlsModel: this.controlsModel
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

		},

		// render: function () {
			// var self = this;
	        // window.requestAnimationFrame(function(){
	        //   self.tick();
	        // });
		// },

		tick: function () {
	        _.each(this.subviewInstances, function (subview) {
	        	if (subview.tick) {
	        		subview.tick();
	        	}
	        });
		},

		views: function () {
			return {
				'.environment': {
					view: EnvironmentView,
					options: {
						socket: this.socket,
						cameraModel: this.cameraModel,
						width: this.width,
						height: this.height
					}
				},

				'.player': {
					view: PlayerView,
					options: {
						socket: this.socket,
						cameraModel: this.cameraModel,
						model: this.playerModel,
						width: this.width,
						height: this.height
					}
				}
			};
		}

	});

module.exports = GameView;
