'use strict';

var LoaderView = require('./loaderview'),

View = LoaderView.extend({

	isRendered: false,

	render: function () {
		this.isRendered = true;
		this._super.apply(this, arguments);
	}

});

module.exports = View;