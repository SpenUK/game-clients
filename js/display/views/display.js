'use strict';

var ViewExtension = require('../../extensions/view'),
	ModelExtension = require('../../extensions/model'),
	QRCodeView = require('./qrcode'),
	GameView = require('./game/game'),
	template = require('../templates/display.hbs'),

	DisplayView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			var gameData = {};
			this.gameModel = new ModelExtension(gameData);

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
