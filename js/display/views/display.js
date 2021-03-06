'use strict';

var ViewExtension = require('../../extensions/view'),
	ticker = require('../ticker'),
	ConnectNoticeView = require('./connectnotice/connectnotice'),
	GameView = require('./game/game'),
	ModalView = require('./modal/modal'),
	GameModel = require('../models/game'),
	template = require('../templates/display.hbs'),

	DisplayView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		debugName: 'display',

		initialize: function() {
			this.model = new GameModel({
				height: 400,
				width: 600,
				deadzone: {
					x: 300,
					y: 200
				}
			}, {
				socket: this.socket
			});

			this._super.apply(this, arguments);

			this.socket.on('controller left', this.onControllerLeft.bind(this));
			this.socket.on('controller joined', this.onControllerJoined.bind(this));

			this.socket.on('open store', this.openStore.bind(this));
		},

		openStore: function (data) {
			this.model.trigger('openStore', data);
		},

		views: function () {
			var views = {
				'.modal': {
					view: ModalView,
					options: {
						dismissable: false,
						width: 620
					}
				},

				'.game': {
					view: GameView,
					options: {
						model: this.model,
						socket: this.socket
					}
				}
			};
			return views;
		},

		render: function () {
			var modalView;

			this._super.apply(this, arguments);

			modalView = this.getModalView();

			this.showConnectNotice();
		},

		onControllerJoined: function () {
			if (ticker.initialized) {
				ticker.unpause();
			}

			this.hideModal();
		},

		onControllerLeft: function () {
			ticker.pause();
			this.showConnectNotice();
		},

		showConnectNotice: function () {
			this.openModalWith({
				view: ConnectNoticeView,
				options: {
					socket: this.socket,
					model: this.model
				}
			});
		},

		hideModal: function () {
			var modalView = this.getModalView();
			if (modalView) {
				modalView.hide();
			}
		},

		getModalView: function () {
			var modalObject = this.subviewInstances.findWhere({key: '.modal'});

			return modalObject ? modalObject.get('view') : false;
		},

		openModalWith: function (viewDefinition) {
			var modalView = this.getModalView();

			function openModal () {
				modalView.setContent(viewDefinition);
				modalView.show();
			}

			if (modalView.rendered) {
				openModal();
			} else {
				this.listenToOnce(modalView, 'afterRender', openModal);
			}
		}
	});

module.exports = DisplayView;
