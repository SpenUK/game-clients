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
	template = require('../../templates/game/game.hbs'),

	GameView = ViewExtension.extend({

		template: template,

		tagName: 'canvas',

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

  			console.log(this.currentMap);

		},

		setContexts: function () {
			var backgroundCtx = getContext('background'),
				playerCtx = getContext('player'),
				coverCtx = getContext('cover'),
				propsCtx = getContext('props');

			this.contexts = {
				background: backgroundCtx,
				player: playerCtx,
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
				y = Math.floor(i / this.currentMap.tilesX);

	    	this.drawBackground(x, y, tileType.base);
	    	this.drawProps(x, y, tileType.props);
	    	this.drawCover(x, y, tileType.cover);
		},

		drawBackground: function (x, y, tile) {
			var tileSize = this.currentMap.tileSize,
				srcX = tile % this.currentMap.tileSet.tilesX,
				srcY = Math.floor(tile / this.currentMap.tileSet.tilesX);

			this.contexts.background.drawImage(
		        this.mapImage, // image
		        srcX * tileSize, // source x start
				srcY * tileSize, // source y start
				tileSize, // source x width
				tileSize, // source y height
				x * tileSize, // placement x
				y * tileSize, // placement y
				tileSize, // height
				tileSize // width
	    	);
		},

		drawProps: function (x, y, tile) {
			var tileSize = this.currentMap.tileSize,
				srcX = tile % this.currentMap.tileSet.tilesX,
				srcY = Math.floor(tile / this.currentMap.tileSet.tilesX);

			this.contexts.props.drawImage(
		        this.mapImage, // image
		        srcX * tileSize, // source x start
				srcY * tileSize, // source y start
				tileSize, // source x width
				tileSize, // source y height
				x * tileSize, // placement x
				y * tileSize, // placement y
				tileSize, // height
				tileSize // width
	    	);
		},

		drawCover: function (x, y, tile) {
			var tileSize = this.currentMap.tileSize,
				srcX = tile % this.currentMap.tileSet.tilesX,
				srcY = Math.floor(tile / this.currentMap.tileSet.tilesX);

			this.contexts.cover.drawImage(
		        this.mapImage, // image
		        srcX * tileSize, // source x start
				srcY * tileSize, // source y start
				tileSize, // source x width
				tileSize, // source y height
				x * tileSize, // placement x
				y * tileSize, // placement y
				tileSize, // height
				tileSize // width
	    	);
		},

		serialize: function () {
			return {
				gameWidth: '600px',
				gameHeight: '400px'
			};
		}

	});

module.exports = GameView;
