'use strict';

var ViewExtension = require('../../extensions/view'),
	Collection = require('../../extensions/collection'),
	Model = require('../../extensions/model'),
	ControlsView = require('./controls'),
	MessagesView = require('./messages/messages'),
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

			console.log(this.socket);

			this.controlsModel = new Model();
			this.sentMessagesCollection = new Collection();
			this.recievedMessagesCollection = new Collection();

			this.listenTo(this.controlsModel, 'control', this.addSentControlMessage);
		},

		addSentControlMessage: function (message) {
			console.log(message);
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
				},
				'.sent-messages': {
					view: MessagesView,
					options: {

						collection: this.sentMessagesCollection
					}
				},
				'.recieved-messages': {
					view: MessagesView,
					options: {
						socket: this.socket,
						collection: this.recievedMessagesCollection
					}
				}
			};
			return views;
		},

		render: function () {
			this._super.apply(this, arguments);
			this.socket.once('set token', this.addToken.bind(this));
		},

		addToken: function (token) {
			console.log(token);
			this.token = token;
			console.log(this);
			this.$el.find('.token').html(token);
		},

	});

module.exports = ControllerView;
