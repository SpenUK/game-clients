'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var _ = require('underscore'),
    ModelExtension = require('../../extensions/model'),
    LayersCollection = require('../collections/layers'),
    ObjectsCollection = require('../collections/objects'),
    TilesetsCollection = require('../collections/tilesets'),
    canvasUtils = require('../../utils/canvas'),

    MapModel = ModelExtension.extend({

        isReady: false,

        acceptedParams: ['entitiesCollection', 'cameraModel'],

        initialize: function(attributes, options) {
            attributes = attributes;
            var tilesets = this.get('tilesets'),
                tileLayers = this.get('tilelayers'),
                objectLayers = this.get('objectlayers');

            // needs to be better...
            this.entitiesCollection = options.entitiesCollection;
            this.cameraModel = options.cameraModel;

            this._super.apply(this, arguments);

            this.tilesets = new TilesetsCollection(tilesets);

            this.layers = new LayersCollection(tileLayers, {
                tilesets: this.tilesets
            });

            var parsedObjects = this.parseObjectsFromLayers(objectLayers);

            this.setCollisions();
            this.setPortals();

            var objectsCollection = this.setObjectsCollection();
            objectsCollection.add(parsedObjects);

            if (this.tilesets.isReady) {
            } else {
                this.listenTo(this.tilesets, 'allReady', this.setTilesetMap);
            }

            this.listenTo(this.collection, 'changed:currentMap', this.onMapChange);

            this.inBoundsCount = 0;
        },

        onMapChange: function () {
            this.entitiesCollection.removeSprites();
        },

        getCollisions: function () {
            return this.collisions || this.setCollisions();
        },

        setCollisions: function () {
            var collisionsLayer = this.get('collisions');
            this.collisions = collisionsLayer ? collisionsLayer.objects : [];

            return this.collisions;
        },

        getPortals: function () {
            return this.portals || this.setPortals();
        },

        setPortals: function () {
            var portalsLayer = this.get('portals');
            this.portals = portalsLayer ? portalsLayer.objects : [];

            return this.portals;
        },

        parseObjectsFromLayers: function (objectLayers) {
            return _.flatten(_.map(objectLayers, function (layer) {
                return _.map(layer.objects, function (object) {
                    return {
                        name: object.name,
                        x: Math.floor(object.x / 32),
                        y: Math.floor(object.y / 32)
                    };
                });
            }), true);
        },

        getObjectsCollection: function () {
            return this.objectsCollection || this.setObjectsCollection.apply(this, arguments);
        },

        setObjectsCollection: function (objects) {
            objects = objects || [];

            this.objectsCollection = new ObjectsCollection(objects, {
                entitiesCollection: this.entitiesCollection,
                mapModel: this
            });

            return this.objectsCollection;
        },

        setTilesetMap: function () {
            this.tilesetMap = _.flatten(_.union([], this.tilesets.sortBy('firstgid').map(function (tileset) {
                return _.map(_.range(0, tileset.get('tilecount')), function () {
                    return tileset.getPacket();
                });
            })));

            this.ready();
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
            var columns = this.get('width'),
                x = tile % columns,
                y = parseInt(tile / columns);

                return {x: x, y: y};
        },

        getTileIndex: function (tile) {
          var x = tile.x,
              y = tile.y;

              return (y * this.get('width')) + x;
        },

        getCollision: function (target) {
            var collision = _.findWhere(this.getCollisions(), target);

            return collision && collision.code ? collision.code : 0;
        },

        getPortal: function (target) {
            var portal = _.findWhere(this.getPortals(), target);

            return portal;
        },

        draw: function () {
            this.layers.each(this.drawLayer.bind(this));
        },

        drawLayer: function (layer) {
            _.each(layer.attributes.tiles, this.drawTile.bind(this));

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
                translateX = this.cameraModel.x,
                translateY = this.cameraModel.y;

            if (!tileset || !tileset.image) {
                return false;
            }

            var inBounds =  x * tilewidth < - translateX + canvasWidth &&
                            y * tileheight < - translateY + canvasHeight &&
                            (x + 1) * tilewidth > - translateX &&
                            (y + 1) * tileheight > - translateY;

            inBounds = inBounds;

            if (!inBounds) {
                return false;
            }

            var srcX = (tile - tileset.gidoffset) % tileset.width,
                srcY = Math.floor((tile - tileset.gidoffset) / tileset.width);

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