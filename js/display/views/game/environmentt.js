'use strict';

var _ = require('underscore'),
	canvasUtils = require('../../../utils/canvas'),
	ViewExtension = require('../../../extensions/view'),
	template = require('../../templates/game/environment.hbs'),

	EnviromentView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket', 'cameraModel'],

		isReady: false,

		currentX: 0,

		currentY: 0,

		initialize: function() {
			this._super.apply(this, arguments);

  			window.env = this;

  			this.setMap();

			this.listenTo(this.cameraModel, 'updated', this.translateAll.bind(this));
		},

		setMap: function () {
			this.map = this.model.getCurrentMap();
			if (this.map.isReady) {
				this.ready();
			} else {
				this.listenTo(this.map, 'ready', this.ready);
			}
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

		tick: function () {
			this.translateAll();
		},

		draw: function () {
			var map = this.map,
				layers = map.layers;


			// function a (layer, map) {
			// 	return _.uniq(_.map(layer.attributes.tiles, function (a) {
			// 		return map.tilesetImageMap[a -1];
			// 	}));
			// }
			layers.each(this.drawLayer.bind(this));
			// layers.each(function (layer) {
			// 	layer.attributes.each(function () {

			// 	})
			// });
			// layers.each(function (layer) {
			// 	console.log(a(layer, map));
			// });
			// debugger;
		},

		drawLayer: function (layer) {
			_.each(layer.attributes.tiles, this.drawTile.bind(this));
		},

		drawTile: function (tile, i) {
			var map = this.model.getCurrentMap(), // should really just create a map ViewExtension
				x = i % map.attributes.width,
				y = Math.floor(i / map.attributes.width),
				tileheight = map.attributes.tileheight,
				tilewidth = map.attributes.tilewidth,
				tileset = map.tilesetMap[tile],
				canvasWidth = this.model.attributes.width,
				canvasHeight = this.model.attributes.height,
				translateX = this.cameraModel.x,
				translateY = this.cameraModel.y;

			if (!tileset || !tileset.image) {
				return false;
			}

			var inBounds = 	x * tilewidth < - translateX + canvasWidth &&
	                		y * tileheight < - translateY + canvasHeight &&
	                		(x + 1) * tilewidth > - translateX &&
	                		(y + 1) * tileheight > - translateY;

	        if (!inBounds) {
				return false;
			}

    		var srcX = (tile - tileset.gidoffset) % tileset.width,
				srcY = Math.floor((tile - tileset.gidoffset) / tileset.width);

			this.contexts.base.drawImage(
		        tileset.image, // image
		        srcX * tilewidth, // source x start
				srcY * tileheight, // source y start
				tilewidth, // source x width
				tileheight, // source y height
				x * tilewidth, // placement x
				y * tileheight, // placement y
				tilewidth, // height
				tileheight // width
	    	);
		},

		translateAll: function () {
			var x = this.cameraModel.x,
				y = this.cameraModel.y,
				context = this.contexts.base;

				// console.log(x,y);

		    // _.each([
		    	// this.contexts.base,
		    	// this.contexts.cover,
		    	// this.contexts.props
		    // ], function(context) {
		    	context.clearRect(0, 0, this.model.attributes.width, this.model.attributes.height);
		    	context.save();

		    	context.translate(x, y);

		    // }, this);
			x = x;
			y = y;

		    this.draw();

		    // _.each([
		    // 	this.contexts.base,
		    // 	this.contexts.cover,
		    // 	this.contexts.props
		    // ], function(context) {
		    	context.restore();
		    // });
		},

		serialize: function () {
			return {
				gameWidth: this.model.get('width') + 'px',
				gameHeight: this.model.get('height') + 'px'
			};
		}
	});

module.exports = EnviromentView;
