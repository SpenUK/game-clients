'use strict';

var _ = require('underscore'),
	canvasUtils = require('../../../utils/canvas'),
	ViewExtension = require('../../../extensions/view'),
	SpritesView = require('./sprites'),
	SpritesCollection = require('../../collections/sprites'),
	template = require('../../templates/game/environment.hbs'),

	EnviromentView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket', 'cameraModel'],

		isReady: false,

		currentX: 0,

		currentY: 0,

		initialize: function() {
			var loader,
				map = this.model.getCurrentMap(),
				tileSet = map.get('tileSet'),
				sprites = this.getSprites();

			this.spritesCollection = new SpritesCollection(sprites);

			this._super.apply(this, arguments);

			loader = canvasUtils.preloadImages([tileSet.src]);

			if (loader.state() === 'resolved') {
				this.ready();
			} else {
				loader.then(this.ready.bind(this));
			}

			this.mapImage = new Image();
  			this.mapImage.src = tileSet.src;

  			this.currentMap = map;

			this.listenTo(this.cameraModel, 'updated', this.translateAll.bind(this));
		},

		getSprites: function () {
			var model = this.model.getCurrentMap(),
				spriteMap = window.initialData.npcs,
				sprites = model.get('npcs') || [];

			return _.map(sprites, function (sprite) {
				return _.extend(spriteMap[sprite.ref], {
					x: sprite.x,
					y: sprite.y
				});
			});
		},

		setContexts: function () {
			var baseCtx = canvasUtils.getContext('base'),
				coverCtx = canvasUtils.getContext('cover'),
				propsCtx = canvasUtils.getContext('props');

			this.contexts = {
				base: baseCtx,
				cover: coverCtx,
				props: propsCtx
			};
		},

		render: function () {
			this._super.apply(this, arguments);
			this.setContexts();

			this.model.ticker.register('environment-tick', this.tick.bind(this));
		},

		views: function () {
			return {
				'.sprites': {
					view: SpritesView,
					options: {
						collection: this.spritesCollection,
						socket: this.socket,
						cameraModel: this.cameraModel
					}
				}
			};
		},

		tick: function () {
			this.translateAll();
		},

		draw: function () {
			var map = this.model.getCurrentMap(),
				tiles = map.get('tileMap');
				// avoiding having to .get() for each draw of each tile...
				this.currentMap = map;

			_.each(tiles, this.drawTile.bind(this));
		},

		drawTile: function (tile, i) {
			var tileType = this.currentMap.attributes.tileTypes[tile],
				x = i % this.currentMap.attributes.tilesX,
				y = Math.floor(i / this.currentMap.attributes.tilesX),
				currentMap = this.currentMap,
				tileSize = currentMap.attributes.tileSize,
				contexts = this.contexts,
				image = this.mapImage,
				canvasWidth = this.model.attributes.width,
				canvasHeight = this.model.attributes.height,
				translateX = this.cameraModel.x,
				translateY = this.cameraModel.y;

			var inBounds = 	x * tileSize < - translateX + canvasWidth &&
                    		y * tileSize < - translateY + canvasHeight &&
                    		(x + 1) * tileSize > - translateX &&
                    		(y + 1) * tileSize > - translateY;

			if (!inBounds) {
				return false;
			}
	    	_.each([
	    		'base',
	    		'props',
	    		'cover'
	    	], function(id){
	    		var tile = tileType[id],
		    		srcX = tile % currentMap.attributes.tileSet.tilesX,
					srcY = Math.floor(tile / currentMap.attributes.tileSet.tilesX);

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

		translateAll: function () {
			var x = this.cameraModel.x,
				y = this.cameraModel.y;

				// console.log(x,y);

		    _.each([
		    	this.contexts.base,
		    	this.contexts.cover,
		    	this.contexts.props
		    ], function(context) {
		    	context.clearRect(0, 0, this.model.attributes.width, this.model.attributes.height);
		    	context.save();

		    	context.translate(x, y);

		    }, this);

		    this.draw();

		    _.each([
		    	this.contexts.base,
		    	this.contexts.cover,
		    	this.contexts.props
		    ], function(context) {
		    	context.restore();
		    });
		},

		serialize: function () {
			return {
				gameWidth: this.model.get('width') + 'px',
				gameHeight: this.model.get('height') + 'px'
			};
		}
	});

module.exports = EnviromentView;
