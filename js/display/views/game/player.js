'use strict';

function getCanvas(id) {
	var canvas = document.getElementById(id);
	return canvas && canvas.nodeName === 'CANVAS' ? canvas : false;
}

function getContext(id, contextType) {
	contextType = contextType || '2d';
	var canvas = getCanvas(id);
	return canvas ? canvas.getContext(contextType) : false;
}

function preloadImages(images) {
	var deferred = new $.Deferred(),
		loader = new Image(),
		total = images.length,
		count = 0;

	loader.onload = function(){
		count += 1;

		if (count === total) {
			deferred.resolve();
		} else {
			loader.src = images.pop();
		}
	};

	loader.src = images.pop();

	return deferred;
}

var _ = require('underscore'),
	ViewExtension = require('../../../extensions/view'),
	template = require('../../templates/game/player.hbs'),

	PlayerView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket', 'cameraModel','height', 'width'],

		isReady: false,

		translateX: 0,

		translateY: 0,

		initialize: function() {
			this._super.apply(this, arguments);
			_ = _;

			var loader,
				playerData = window.initialData.player;

			//  model?
			this.data = playerData;

			this._super.apply(this, arguments);

			loader = preloadImages([playerData.spriteMap.src]);

			this.image = new Image();
  			this.image.src = playerData.spriteMap.src;

			if (loader.state() === 'resolved') {
				this.ready();
			} else {
				loader.then(this.ready.bind(this));
			}

			this.listenTo(this.model, 'change:y change:x', this.startMoving);
			this.listenTo(this.cameraModel, 'updated', this.draw);
		},

		startMoving: function () {
			// console.log('startMove');
			// this.draw();
		},

		canMoveToTile: function () {
			return true;
		},

		render: function () {
			this._super.apply(this, arguments);
			this.context = getContext('player');
			this.draw();
		},

		draw: function () {
			var srcX = 1,
				srcY = 1,
				x = this.model.get('x'),
				y = this.model.get('y'),
				tileSize = 50;

			// console.log(x, y, x * tileSize, y * tileSize, this.cameraModel.x, this.cameraModel.y);
			this.context.clearRect(0,0,600,400);

	    	this.context.drawImage(
		        this.image, // image
		        srcX * tileSize, // source x start
				srcY * tileSize, // source y start
				tileSize, // source x width
				tileSize, // source y height
				(x * tileSize) + this.cameraModel.x, // placement x
				(y * tileSize) + this.cameraModel.y, // placement y
				tileSize, // height
				tileSize // width
	    	);
		},

		// translateAll: function (x, y) {
		// 	this.translateX += x;
		// 	this.translateY += y;

		// 	console.log(this.translateX, this.translateY);
		//     _.each([
		//     	this.contexts.base
		//     	// this.contexts.cover,
		//     	// this.contexts.props
		//     ], function(context) {
		//     	context.clearRect(0, 0, 600 - this.translateX, 400 - this.translateY);
		//     	context.save();
		//     	context.translate(x, y);
		//     	context.restore();
		//     }, this);

		//     this.draw();
		// },

		serialize: function () {
			return {
				gameWidth: this.width + 'px',
				gameHeight: this.height + 'px'
			};
		}
	});

module.exports = PlayerView;
