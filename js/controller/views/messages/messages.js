'use strict';

var _ = require('underscore'),
	CollectionView = require('../../../extensions/collectionview'),
	// Collection = require('../../../extensions/collection'),
	MessageView = require('./message'),
	// template = require('../../templates/messages.hbs'),

	MessagesView = CollectionView.extend({

		acceptedParams: ['socket'],

		itemView: MessageView,

		initialize: function() {
			_.bindAll(this, 'addMessage', 'onControlPress');

			// this.collection = new Collection();

			this._super.apply(this, arguments);

			if (this.socket) {
				this.socket.on('message', this.addMessage);
				this.socket.on('control press', this.onControlPress);
			}
		},

		addMessage: function (data) {
			console.log(data);
			this.collection.add({
				username: data.id,
				message: data.copy,
				messageClass: data.type
			});
		},

		onControlPressSent: function (message) {
			this.collection.add({
				username: window.initialData.token,
				message: message,
				messageClass: 'key-press'
			});
		},

		onControlPress: function (data) {
			this.collection.add({
				username: data.token,
				message: data.message,
				messageClass: 'key-press'
			});
		}

	});

module.exports = MessagesView;