'use strict';

var ViewExtension = require('../../extensions/view'),
	QRCodeView = require('./qrcode'),
	GameView = require('./game/game'),
	GameModel = require('../models/game'),
	template = require('../templates/display.hbs'),

	DisplayView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			this.gameModel = new GameModel({
				height: 400,
				width: 600,
				deadzone: {
					x: 300,
					y: 200
				}
			});

			this._super.apply(this, arguments);

			this.socket.emit('display initialize');
		},

		views: function () {
			var views = {
				'.qrcode': {
					view: QRCodeView,
					options: {
						socket: this.socket
					}
				},

				'.game': {
					view: GameView,
					options: {
						model: this.gameModel,
						socket: this.socket
					}
				}
			};
			return views;
		}

	});

module.exports = DisplayView;
