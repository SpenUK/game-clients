'use strict';

var	ViewExtension = require('../../../extensions/view'),
	template = require('../../templates/game/game.hbs'),

	GameView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		isReady: false,

		initialize: function() {
			this._super.apply(this, arguments);

			this.model.set('controlsModel', this.controlsModel);

			if (this.model.isReady) {
				this.ready();
			} else {
			 	this.listenToOnce(this.model, 'ready', this.ready);
			}

			// this.socket.on('controller joined', this.onControllerJoined.bind(this));

		},

		render: function () {
			this._super.apply(this, arguments);
			this.model.ticker.register('game-tick', this.tick.bind(this));
		},

		tick: function () {
			this.model.tick();
		},

		serialize: function () {
			return {
				gameWidth: this.model.get('width') + 'px',
				gameHeight: this.model.get('height') + 'px'
			};
		}

	});

module.exports = GameView;
