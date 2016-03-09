'use strict';

var ViewExtension = require('../../../extensions/view'),
	EnvironmentView = require('./environment'),
	template = require('../../templates/game/game.hbs'),

	GameView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		views: function () {
			console.log('views');
			return {
				'.environment': {
					view: EnvironmentView,
					options: {
						socket: this.socket
					}
				// },

				// '.player': {
				// 	view: PlayerView,
				// 	options: {

				// 	}
				}
			};
		}

	});

module.exports = GameView;
