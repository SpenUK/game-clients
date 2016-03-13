'use strict';

var ViewExtension = require('../../../../extensions/view'),
	template = require('../../../templates/connectnotice/qr/qr.hbs'),

	QRCodeView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		events: {
			'click a': 'openControlsWindow'
		},

		openControlsWindow: function (e) {
			e.preventDefault();
			window.open(this.model.get('url'), 'controller', 'width=420, height=280, left=900, top=160, menubar=0, status=0, scrollbars=0, toolbar=0');
		},

		render: function () {
			var url = this.model.get('url');
			this._super.apply(this, arguments);

			var $qr = $('<div/>');
			new window.QRCode($qr[0], url);
			this.$el.find('.code').html($qr);
		}

	});

module.exports = QRCodeView;
