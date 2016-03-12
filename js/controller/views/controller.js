'use strict';

var ViewExtension = require('../../extensions/view'),
	Collection = require('../../extensions/collection'),
	Model = require('../../extensions/model'),
	ControlsView = require('./controls'),
	template = require('../templates/controller.hbs'),

	ControllerView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			var initialData = window.initialData;
			this._super.apply(this, arguments);
			if (initialData && initialData.token) {
				this.socket.emit('controller initialize', initialData.token);
			}

			this.disableViewPort();

			this.controlsModel = new Model();
			this.sentMessagesCollection = new Collection();
			this.recievedMessagesCollection = new Collection();

			this.listenTo(this.controlsModel, 'control', this.addSentControlMessage);
		},

		disableViewPort: function () {
			var viewport = document.querySelector('meta[name=viewport]'),
				content = viewport.content.replace(/user-scalable=(\w+)/, 'user-scalable=no');

			viewport.setAttribute('content', content);
		},

		addSentControlMessage: function (message) {
			this.sentMessagesCollection.add({
				username: this.token,
				message: message,
				messageClass: 'key-press'
			});
		},

		views: function () {
			var views = {
				'.controls': {
					view: ControlsView,
					options: {
						socket: this.socket,
						model: this.controlsModel
					}
				}
				// '.sent-messages': {
				// 	view: MessagesView,
				// 	options: {

				// 		collection: this.sentMessagesCollection
				// 	}
				// },
				// '.recieved-messages': {
				// 	view: MessagesView,
				// 	options: {
				// 		socket: this.socket,
				// 		collection: this.recievedMessagesCollection
				// 	}
				// }
			};
			return views;
		}

	});

module.exports = ControllerView;
