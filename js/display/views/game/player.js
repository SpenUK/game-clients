'use strict';

var ViewExtension = require('../../../extensions/view'),
	canvasUtils = require('../../../utils/canvas'),

	PlayerView = ViewExtension.extend({

		acceptedParams: ['socket', 'cameraModel', 'gameModel'],

		isReady: false,

		translateX: 0,

		translateY: 0,

		initialize: function() {

			this._super.apply(this, arguments);

			if (this.model.isReady) {
				this.ready();
			} else {
				this.listenTo(this.model, 'ready', this.ready);
			}
		},

		onReady: function () {
			this.listenTo(this.model, 'change:y change:x', this.startMoving);
			this.listenTo(this.cameraModel, 'updated', this.draw);
		},

		render: function () {
			this._super.apply(this, arguments);
			this.context = canvasUtils.getContext('base');
		},

		tick: function () {
			this.model.update();
			this.draw();
		},

		draw: function () {
			var srcX = 0,
				srcY = 0,
				x = this.model.position.x,
				y = this.model.position.y + (this.model.attributes.offsetY * this.model.attributes.tileSize);

				this.model.cameraModel.setPosition(x, y);

			// this.context.clearRect(0,0, this.gameModel.attributes.width, this.gameModel.attributes.height);
	    	this.context.drawImage(
		        this.model.image, // image
		        srcX * this.model.attributes.tileSize, // source x start
				srcY * this.model.attributes.tileSize, // source y start
				this.model.attributes.tileSize, // source x width
				this.model.attributes.tileSize * this.model.attributes.height, // source y height
				x + this.model.cameraModel.x, // placement x
				y + this.model.cameraModel.y, // placement y
				this.model.attributes.tileSize, // width
				this.model.attributes.tileSize * this.model.attributes.height // height
	    	);
		}
	});

module.exports = PlayerView;
