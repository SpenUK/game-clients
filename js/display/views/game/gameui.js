'use strict';

var	View = require('../../../extensions/view'),
	Model = require('../../../extensions/model'),
	ticker = require('../../ticker'),
	StoreView = require('./store/store'),
	template = require('../../templates/game/gameui.hbs'),

	GameUIView = View.extend({

		template: template,

		acceptedParams: ['socket'],

		uiState: 'empty',

		initialize: function() {
			var controlsModel = this.model.getControlsModel();
			this._super.apply(this, arguments);

			this.listenTo(this.model, 'openStore', function (data) {
				this.openStore(data);
			});


			this.listenTo(controlsModel, 'up', this.onControlUp);

		},

		onControlUp: function (key) {
            if (key === 66) {
                this.cancel();
            }
        },

		openStore: function (data) {
			ticker.pause();

			this.removeSubviewInstances();
			this.renderSubview({
				view: StoreView,
				options: {
					model: new Model(data),
					socket: this.socket
				}
			}, '.store');

			this.uiState = 'store';
			this.show();
		},

		show: function () {
			this.$el.fadeIn(200);
		},

		hide: function () {
			this.$el.fadeOut(200);
		},

		render: function () {
			this._super.apply(this, arguments);
			this.hide();
		},

		cancel: function () {
			this.hide();
			ticker.unpause();
			this.removeSubviewInstances();
			this.uiState = 'empty';
		}

	});

module.exports = GameUIView;
