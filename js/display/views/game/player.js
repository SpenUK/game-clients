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

		render: function () {
			this._super.apply(this, arguments);
			this.context = getContext('player');
			this.tick();
			// window.requestAnimationFrame(this.move.bind(this));
		},

		tick: function () {
			this.model.move();
			this.draw();
			window.requestAnimationFrame(this.tick.bind(this));
		},

		draw: function () {
			var srcX = 1,
				srcY = 1,
				x = this.model.position.x,
				y = this.model.position.y,
				tileSize = 50;

			this.context.clearRect(0,0,600,400);
	    	this.context.drawImage(
		        this.image, // image
		        srcX * tileSize, // source x start
				srcY * tileSize, // source y start
				tileSize, // source x width
				tileSize, // source y height
				x + this.cameraModel.x, // placement x
				y + this.cameraModel.y, // placement y
				tileSize, // height
				tileSize // width
	    	);
		},

		serialize: function () {
			return {
				gameWidth: this.width + 'px',
				gameHeight: this.height + 'px'
			};
		}
	});

module.exports = PlayerView;
