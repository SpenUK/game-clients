'use strict';

var ViewExtension = require('../../extensions/view'),
	Model = require('../../extensions/model'),
	ControlsView = require('./controls'),
	TokenInputView = require('./tokeninput/tokeninput'),
	template = require('../templates/controller.hbs'),

	ControllerView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			this._super.apply(this, arguments);

			this.disableViewPort();

			this.controlsModel = new Model();

			this.socket.on('controller joined', this.onSocketJoined.bind(this));
			this.socket.on('controller rejected', this.onSocketReject.bind(this));
			this.socket.on('interaction test', function (message) {
   				console.log(message);
   			});
		},

		onSocketJoined: function () {
			this.render();
		},

		onSocketReject: function () {
			// console.log('onSocketReject', message); // TODO: error state on form.
			this.model.unset('token');
			this.render();
		},

		disableViewPort: function () {
			var viewport = document.querySelector('meta[name=viewport]'),
				content = viewport.content.replace(/user-scalable=(\w+)/, 'user-scalable=no');

			viewport.setAttribute('content', content);
		},

		views: function () {
			var views = {},
				token = this.model.get('token');

			if (token) {
				views['.controls'] = {
					view: ControlsView,
					options: {
						socket: this.socket,
						model: this.controlsModel
					}
				};
			} else {
				views['.token-input'] = {
					view: TokenInputView
				};
			}

			return views;
		}

	});

module.exports = ControllerView;
