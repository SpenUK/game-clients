'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var _ = require('underscore'),
    ModelExtension = require('../../extensions/model'),
    LayersCollection = require('../collections/layers'),
    ObjectLayersCollection = require('../collections/objectlayers'),
    TilesetsCollection = require('../collections/tilesets'),
    // canvasUtils = require('../../utils/canvas'),

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
        }
    });

module.exports = MapModel;