'use strict';

var ViewExtension = require('../../../extensions/view'),
	QrView = require('./qr/qr'),
	template = require('../../templates/connectnotice/connectnotice.hbs'),

	ConnectNoticeView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket', 'modalView'],

		isReady: false,

		initialize: function() {
			this._super.apply(this, arguments);

			if (this.model.get('url')) {
				this.ready();
			} else {
				this.listenTo(this.model, 'change:url', this.ready);
			}
		},

		views: function () {
			return {
				'.qr': {
					view: QrView,
					options: {
						socket: this.socket
					}
				}
			};
		}
	});

module.exports = ConnectNoticeView;
