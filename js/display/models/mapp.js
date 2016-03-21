'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var _ = require('underscore'),
    ModelExtension = require('../../extensions/model'),
    LayersCollection = require('../collections/layers'),
    ObjectLayersCollection = require('../collections/objectlayers'),
    TilesetsCollection = require('../collections/tilesets'),
    canvasUtils = require('../../utils/canvas'),

    MapModel = ModelExtension.extend({

        isReady: false,

        initialize: function() {
            var tilesets = this.get('tilesets'),
                layers = this.get('layers'),
                tileLayers = _.filter(layers, function (layer) {
                    return layer.type === 'tilelayer';
                }),
                objectLayers = _.filter(layers, function (layer) {
                    return layer.type === 'objectgroup';
                });

            this._super.apply(this, arguments);

            this.tilesets = new TilesetsCollection(tilesets);


            this.layers = new LayersCollection(tileLayers, {
                tilesets: this.tilesets
            });

            this.objects = new ObjectLayersCollection(objectLayers);

            if (this.tilesets.isReady) {
            } else {
                this.listenTo(this.tilesets, 'allReady', this.setTilesetMap);
            }

            this.inBoundsCount = 0;
        },

        setTilesetMap: function () {
            this.tilesetMap = _.flatten(_.union([], this.tilesets.sortBy('firstgid').map(function (tileset) {
                return _.map(_.range(0, tileset.get('tilecount')), function () {
                    return tileset.getPacket();
                });
            })));

            this.ready();
        },

        getCollisions: function () {
            return false;
        },

        setImages: function () {
            var images = {};

            _.each(this.tilesetModels, function (model) {
                images[model.get('src')] = model.get('image');
            });

            this.images = images;

            this.ready();
        },

        getCoords: function (tile) {
            var columns = this.get('tilesX'),
                x = tile % columns,
                y = parseInt(tile / columns);

                return {x: x, y: y};
        },

        getTileIndex: function (tile) {
          var x = tile.x,
              y = tile.y;

              return (y * this.get('tilesX')) + x;
        },

        draw: function () {
            this.layers.each(this.drawLayer.bind(this));
        },

        drawLayer: function (layer) {
            _.each(layer.attributes.tiles, this.drawTile.bind(this));

            debugger;
            console.log(this.inBoundsCount);
            this.inBoundsCount = 0;
        },

        drawTile: function (tile, i) {
            var map = this,
                x = i % map.attributes.width,
                y = Math.floor(i / map.attributes.width),
                tileheight = map.attributes.tileheight,
                tilewidth = map.attributes.tilewidth,
                tileset = map.tilesetMap[tile],
                // canvasWidth = this.model.attributes.width,
                // canvasHeight = this.model.attributes.height,
                canvasWidth = 600,
                canvasHeight = 400,
                translateX = 0,//this.cameraModel.x,
                translateY = 0; //this.cameraModel.y;

            if (!tileset || !tileset.image) {
                return false;
            }

            var inBounds =  x * tilewidth < - translateX + canvasWidth &&
                            y * tileheight < - translateY + canvasHeight &&
                            (x + 1) * tilewidth > - translateX &&
                            (y + 1) * tileheight > - translateY;

            inBounds = inBounds;

            if (!inBounds) {
                // return false;
            } else {
                this.inBoundsCount += 1;
            }

            var srcX = (tile - tileset.gidoffset) % tileset.width,
                srcY = Math.floor((tile - tileset.gidoffset) / tileset.width);

                console.log(x * tilewidth, y * tileheight);

            canvasUtils.getContext('base').drawImage(
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

        }
    });

module.exports = MapModel;