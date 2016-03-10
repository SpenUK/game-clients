'use strict';

var _ = require('underscore'),
	ViewExtension = require('../../extensions/view'),
	template = require('../templates/qrcode.hbs'),

	QRCodeView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		isReady: false,

		initialize: function() {
			_.bindAll(this, 'setUrl');

			this._super.apply(this, arguments);

			this.socket.on('token generated', this.setUrl);

			this.socket.on('controller left', this.show.bind(this));

			this.socket.on('controller joined', this.hide.bind(this));

			this.socket.emit('request token');
		},

		setUrl: function (data) {
			this.url = window.location.origin + '/controller/' + data.token;
			this.ready();
		},

		show: function () {
			console.log('show');
			this.$el.fadeIn(500);
		},

		hide: function () {
			this.$el.fadeOut(500);
		},

		render: function () {
			this._super.apply(this, arguments);

			var $qr = $('<div/>');
			new window.QRCode($qr[0], this.url);
			this.$el.find('.code').html($qr);
		},

		serialize: function () {
			return {
				url: this.url
			};
		}

	});

module.exports = QRCodeView;
