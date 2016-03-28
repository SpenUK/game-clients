'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var _ = require('underscore'),
    ModelExtension = require('../../extensions/model'),
    LayersCollection = require('../collections/layers'),
    ObjectsCollection = require('../collections/objects'),
    TilesetsCollection = require('../collections/tilesets'),
    TilesCollection = require('../collections/tiles'),
    // canvasUtils = require('../../utils/canvas'),

    MapModel = ModelExtension.extend({

        isReady: false,

        acceptedParams: ['entitiesCollection', 'cameraModel', 'imagesCollection'],

        initialize: function(attributes, options) {
            attributes = attributes;
            var tilesets = this.get('tilesets'),
                tileLayers = this.get('tilelayers'),
                objectLayers = this.get('objectlayers');

            // needs to be better...
            this.entitiesCollection = options.entitiesCollection;
            this.cameraModel = options.cameraModel;

            this._super.apply(this, arguments);

            this.tilesetsCollection = this.setTilesetCollection(tilesets);

            this.layers = new LayersCollection(tileLayers, {
                tilesets: this.tilesetsCollection
            });

            // debugger;

            var parsedObjects = this.parseObjectsFromLayers(objectLayers);

            this.setCollisions();
            this.setPortals();

            var objectsCollection = this.setObjectsCollection();
            objectsCollection.add(parsedObjects);

            if (this.tilesetsCollection.isReady) {
                this.setTilesetMap();
            } else {
                this.listenToOnce(this.tilesetsCollection, 'allReady', this.onTilesetsReady);
            }
        },

        onTilesetsReady: function () {
            this.setTiles();
            this.ready();
        },

        ready: function () {
            this.setTilesetMap();
            this._super.apply(this, arguments);

        },

        activate: function () {
            console.log(this.get('name'));
            this.getObjectsCollection().activate();
            this.getTiles().activate();
            window.mappy = this;
        },

        deactivate: function () {
            this.getObjectsCollection().deactivate();
            this.getTiles().deactivate();
        },

        onMapChange: function () {
            this.entitiesCollection.removeSprites();
        },

        getTilesetCollection: function () {
            return this.tilesetCollection || this.setTilesetCollection.apply(this, arguments);
        },

        setTilesetCollection: function (tilesets) {
            this.tilesetCollection = new TilesetsCollection(tilesets, {
                imagesCollection: this.imagesCollection
            });

            return this.tilesetCollection;
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

        getTiles: function () {
            return this.tiles || this.setTiles();
        },

        setTiles: function () {
            console.log('create new tiles collection');
            this.tiles = new TilesCollection(this.get('tiles'), {
                entitiesCollection: this.entitiesCollection,
                tilesetsCollection: this.tilesetsCollection,
                name: this.get('name'),
                mapModel: this
            });

            return this.tiles;
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
            this.tilesetMap = _.flatten(_.union([], this.tilesetsCollection.sortBy('firstgid').map(function (tileset) {
                return _.map(_.range(0, tileset.get('tilecount')), function () {
                    return tileset.getPacket();
                });
            })));
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
        }

    });

module.exports = MapModel;