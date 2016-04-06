'use strict';

var ViewExtension = require('../../extensions/view'),
	// Model = require('../../extensions/model'),
	ControlsView = require('./controls'),
	StoreControlsView = require('./storecontrols'),
	StoreItemControlsView = require('./storeitemcontrols'),
	// ViewStackCollection = require('../collections/viewstack'),
	TokenInputView = require('./tokeninput/tokeninput'),
	template = require('../templates/controller.hbs'),

	ControllerView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			this._super.apply(this, arguments);

			this.disableViewPort();

			// this.viewStack = new ViewStackCollection();

			this.socket.on('controller joined', this.onSocketJoined.bind(this));
			this.socket.on('controller rejected', this.onSocketReject.bind(this));
			this.socket.on('open store', this.showStore.bind(this));

			console.log(this.model);

			this.listenTo(this.model, 'change:controllerState', this.render);

			$(window).on('keyup', (function(e) {
				console.log(e.which);
				if (e.which === 81) {
					this.showStore({

					});
				} else if (e.which === 87) {
					this.showStoreItem({

					});
				}
			}).bind(this));
		},

		onSocketJoined: function () {
			console.log('socket joined');
			this.render();
		},

		onSocketReject: function () {
			// console.log('onSocketReject', message); // TODO: error state on form.
			this.model.unset('token');
			this.render();
		},

		showStore: function (data) {
			console.log(data);
			this.model.set('controllerState', 'store');
		},

		showStoreItem: function (data) {
			console.log(data);
			this.model.set('controllerState', 'storeItem');
		},

		disableViewPort: function () {
			var viewport = document.querySelector('meta[name=viewport]'),
				content = viewport.content.replace(/user-scalable=(\w+)/, 'user-scalable=no');

			viewport.setAttribute('content', content);
		},

		views: function () {
			var views = {},
				token = this.model.get('token'),
				controllerState = this.model.get('controllerState'),
				View = ControlsView;

				console.log(controllerState);

			if (token) {
				if (controllerState === 'store') {
					View = StoreControlsView;
				} else if (controllerState === 'storeItem') {
					View = StoreItemControlsView;
				}

				views['.controls'] = {
					view: View,
					options: {
						socket: this.socket,
						// model: this.controlsModel
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
