'use strict';

var ViewExtension = require('../../../extensions/view'),
	template = require('../../templates/messages/message.hbs'),

	MessagesView = ViewExtension.extend({

		template: template,

		render: function () {
			console.log(this.model);
			this._super.apply(this, arguments);
		},

	});

module.exports = MessagesView;
