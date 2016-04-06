'use strict';

var ViewExtension = require('../../extensions/view'),
	Model = require('../../extensions/model'),
	ControlsView = require('./controls'),
	StoreControlsView = require('./storecontrols'),
	StoreItemControlsView = require('./storeitemcontrols'),
	ViewStackCollection = require('../collections/viewstack'),
	TokenInputView = require('./tokeninput/tokeninput'),
	template = require('../templates/controller.hbs'),

	ControllerView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			this._super.apply(this, arguments);

			this.disableViewPort();

			this.viewStack = new ViewStackCollection();

			this.socket.on('controller joined', this.onSocketJoined.bind(this));
			this.socket.on('controller rejected', this.onSocketReject.bind(this));
			this.socket.on('open store', this.showStore.bind(this));

			this.listenTo(this.model, 'change:controllerState', this.render);
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
			var subviewDefinition = {
				view: StoreControlsView,
				options: {
					socket: this.socket,
					parentView: this,
					model: new Model(data)
				}
			};

			this.viewStack.push(subviewDefinition);

			this.removeSubviewInstances();
			this.renderSubview(subviewDefinition, '.controls');
		},

		showStoreItem: function (model) {
			var subviewDefinition = {
				view: StoreItemControlsView,
				options: {
					socket: this.socket,
					parentView: this,
					model: model
				}
			};

			this.viewStack.push(subviewDefinition);

			this.removeSubviewInstances();
			this.renderSubview(subviewDefinition, '.controls');
		},

		goBack: function () {
				this.viewStack.pop();
				var target = this.viewStack.last(),
				viewDefinition;

			if (target) {
				viewDefinition = {
					view: target.get('view'),
					options: target.get('options')
				};

				this.removeSubviewInstances();
				this.renderSubview(viewDefinition, '.controls');
			} else {
				this.showDefaultControls();
			}
		},

		showDefaultControls: function () {
			this.removeSubviewInstances();
			this.renderSubview({
				view: ControlsView,
				options: {
					socket: this.socket
				}
			}, '.controls');
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

			if (token) {
				if (controllerState === 'store') {
					View = StoreControlsView;
				} else if (controllerState === 'storeItem') {
					View = StoreItemControlsView;
				}

				views['.controls'] = {
					view: View,
					options: {
						socket: this.socket
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
