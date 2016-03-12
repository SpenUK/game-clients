'use strict';

var ViewExtension = require('../../extensions/view'),
	ConnectNoticeView = require('./connectnotice/connectnotice'),
	QrView = require('./connectnotice/qr/qr'),
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

			window.displayView = this;

			this._super.apply(this, arguments);

			this.socket.emit('display initialize');
		},

		views: function () {
			var views = {
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
		},

		render: function () {
			this._super.apply(this, arguments);
			this.showConnectNotice();
		},

		showConnectNotice: function () {
			this.openModalWith({
				view: QrView,
				options: {
					socket: this.socket
				}
			});
		},

		showConnectNotice2: function () {
			this.openModalWith({
				view: ConnectNoticeView,
				options: {
					socket: this.socket
				}
			});
		},

		openModalWith: function (viewDefinition) {
			var modalView,
				modalObject = this.subviewInstances.findWhere({key: '.modal'});

			if (modalObject) {
				modalView = modalObject.get('view');
				modalView.setContent(viewDefinition).show();

				return true;
			}

			return false;
		}
	});

module.exports = DisplayView;
