'use strict';

var ViewExtension = require('../../../extensions/view'),
	canvasUtils = require('../../../utils/canvas'),
	template = require('../../templates/game/sprites.hbs'),

	PlayerView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket', 'cameraModel', 'gameModel'],

		isReady: false,

		translateX: 0,

		translateY: 0,

		initialize: function() {

			this._super.apply(this, arguments);

			if (this.collection.isReady) {
				// console.log('collection is ready');
				this.ready();
			} else {
				// console.log('collection not ready');
				// this.listenToOnce(this.collection, 'allReady', this.ready);
			}

		},

		onReady: function () {
			// debugger; // current state: ready too fast...
			// console.log('sprites onReady');
			this.listenTo(this.cameraModel, 'updated', this.draw);
		},

		render: function () {
			this._super.apply(this, arguments);
			this.context = canvasUtils.getContext('sprites');
			// this.draw();
			this.gameModel.ticker.register('sprites-tick', this.tick.bind(this));
		},

		tick: function () {
			this.model.move();
			this.drawSprites();
		},

		drawSprites: function () {
			this.context.clearRect(0,0, this.gameModel.attributes.width, this.gameModel.attributes.height);
			// console.log(this.collection.length);
		},

		// draw: function () {
		// 	var srcX = 0,
		// 		srcY = 0,
		// 		x = this.model.position.x,
		// 		y = this.model.position.y + (this.model.attributes.offsetY * this.model.attributes.tileSize);

	 //    	this.context.drawImage(
		//         this.model.image, // image
		//         srcX * this.model.attributes.tileSize, // source x start
		// 		srcY * this.model.attributes.tileSize, // source y start
		// 		this.model.attributes.tileSize, // source x width
		// 		this.model.attributes.tileSize * this.model.attributes.height, // source y height
		// 		x + this.cameraModel.x, // placement x
		// 		y + this.cameraModel.y, // placement y
		// 		this.model.attributes.tileSize, // width
		// 		this.model.attributes.tileSize * this.model.attributes.height // height
	 //    	);
		// },

		serialize: function () {
			return {
				gameWidth: this.model.get('width') + 'px',
				gameHeight: this.model.get('height') + 'px'
			};
		}
	});

module.exports = PlayerView;
