'use strict';

var ViewExtension = require('../../../extensions/view'),
	template = require('../../templates/modal/dismissbutton.hbs'),

	DismissButtonView = ViewExtension.extend({

		template: template

	});

module.exports = DismissButtonView;
