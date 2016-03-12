'use strict';

var ViewExtension = require('../../extensions/view'),
	QRCodeView = require('./qrcode'),
	GameView = require('./game/game'),
	ModalView = require('./modal/modal'),
	GameModel = require('../models/game'),
	template = require('../templates/display.hbs'),

	DisplayView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			this.model = new GameModel({
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

				'.modal': {
					view: ModalView
				},

				'.game': {
					view: GameView,
					options: {
						model: this.model,
						socket: this.socket,
					}
				}
			};
			return views;
		}

		// serialize: function () {
		// },

	});

module.exports = DisplayView;
