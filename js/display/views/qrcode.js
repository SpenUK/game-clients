'use strict';

var _ = require('underscore'),
	ViewExtension = require('../../extensions/view'),
	DisplayView = ViewExtension.extend({

		tagName: 'li',

		acceptedParams: ['socket'],

		isReady: false,

		initialize: function() {
			_.bindAll(this, 'setUrl');

			this._super.apply(this, arguments);

			this.socket.on('token generated', this.setUrl);

			this.socket.on('controller joined', this.hide.bind(this));

			this.socket.emit('request token');
		},

		setUrl: function (data) {
			this.url = window.location.origin + '/controller/' + data.token;
			this.ready();
		},

		hide: function () {
			var self = this;
			this.$el.fadeOut(500, function() {
				console.log('remove');
				self.remove();
			});
		},

		render: function () {
			this._super.apply(this, arguments);

			var $qr = $('<div/>');
			new window.QRCode($qr[0], this.url);
			this.$el.html($('<a href="' + this.url + '" target="_blank">').html($qr));
		}

	});

module.exports = DisplayView;
