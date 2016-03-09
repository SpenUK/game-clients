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
	template = require('../../templates/game/environment.hbs'),

	EnviromentView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		isReady: false,

		initialize: function() {
			var loader,
				mapData = window.initialData.map;
			this._super.apply(this, arguments);

			window.game = this;

			loader = preloadImages(['images/exampleTileSet.png']);

			if (loader.state() === 'resolved') {
				this.ready();
			} else {
				loader.then(this.ready.bind(this));
			}

			this.mapImage = new Image();
  			this.mapImage.src = 'images/exampleTileSet.png';

  			this.currentMap = mapData.maps[mapData.defaultMap];

  			console.log(this);

  			this.socket.on('control press', this.onControlPress.bind(this));
		},

		onControlPress: function (data) {
			var message = data.message;
			if (message === 'up') {
				this.translateAll(0, 50);
			}

			if (message === 'down') {
				this.translateAll(0, -50);
			}

			if (message === 'left') {
				this.translateAll(50, 0);
			}

			if (message === 'right') {
				this.translateAll(-50, 0);
			}
		},

		setContexts: function () {
			var baseCtx = getContext('base'),
				coverCtx = getContext('cover'),
				propsCtx = getContext('props');

			this.contexts = {
				base: baseCtx,
				cover: coverCtx,
				props: propsCtx
			};
		},

		render: function () {
			this._super.apply(this, arguments);
			this.setContexts();

			console.log(this.contexts);

			this.draw();
		},

		draw: function () {
			var tiles = this.currentMap.tileMap;
			console.log('drawing');

			_.each(tiles, this.drawTile.bind(this));
		},

		drawTile: function (tile, i) {
			var tileType = this.currentMap.tileTypes[tile],
				x = i % this.currentMap.tilesX,
				y = Math.floor(i / this.currentMap.tilesX),
				currentMap = this.currentMap,
				tileSize = currentMap.tileSize,
				contexts = this.contexts,
				image = this.mapImage;

	    	_.each(['base', 'props', 'cover'], function(id){
	    		var tile = tileType[id],
		    		srcX = tile % currentMap.tileSet.tilesX,
					srcY = Math.floor(tile / currentMap.tileSet.tilesX);

		    	contexts[id].drawImage(
			        image, // image
			        srcX * tileSize, // source x start
					srcY * tileSize, // source y start
					tileSize, // source x width
					tileSize, // source y height
					x * tileSize, // placement x
					y * tileSize, // placement y
					tileSize, // height
					tileSize // width
		    	);
	    	});
		},

		translateAll: function (x, y) {
		    _.each([this.contexts.base, this.contexts.cover, this.contexts.props], function(context) {
		    	context.clearRect(0, 0, 800, 600);
		    	context.save();
		    	context.translate(x, y);
		    });
		    this.draw();
		},

		serialize: function () {
			return {
				gameWidth: '600px',
				gameHeight: '400px'
			};
		}
	});

module.exports = EnviromentView;
