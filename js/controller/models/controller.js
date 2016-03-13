'use strict';

var Model = require('../../extensions/model'),

	ControllerModel = Model.extend({

		initialize: function() {
			this._super.apply(this, arguments);

			this.on('change:token', this.requestHost);

			if (this.get('token')) {
				this.requestHost();
			}
		},

		setToken: function (token) {
			if (token.length === 8 && 'regex?') {
				this.set('token', token);
			} else {
				console.log('token not valid');
			}
		},

		requestHost: function () {
			var token = this.get('token'),
				socket = this.get('socket');

			socket.emit('controller initialize', token);
		}

	});

module.exports = ControllerModel;
