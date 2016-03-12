'use strict';

var ViewExtension = require('../../../extensions/view'),
	template = require('../../templates/messages/message.hbs'),

	MessagesView = ViewExtension.extend({

		template: template

	});

module.exports = MessagesView;
