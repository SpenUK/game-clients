'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var EntityModel = require('./entity'),

    TileModel = EntityModel.extend({

        acceptedParams: ['tilesetCollection', 'imagesCollection'],

        initialize: function() {

            this._super.apply(this, arguments);

            // do better...
            this.tilesetsCollection = this.collection.tilesetsCollection;
            this.name = this.collection.name;

            this._initializePosition();

        },

        getTileset: function () {
            return this.tileset || this.setTileset();
        },

        setTileset: function () {
            var src = this.get('tileset').src;
            this.tileset = this.tilesetsCollection.findWhere({src: src});

            this.setImage(this.tileset.image);

            return this.tileset;
        },

        setImage: function (image) {
            this.image = image;
        },

        _initializePosition: function () {
            var x = this.get('x'),
                y = this.get('y');

            this._setLocation({x: x, y: y});

            this._super.apply(this, arguments);
        },

        _setLocation: function (location) {
            var tileSize = 32,
                attributes = {
                    x: location.x,
                    y: location.y
                };

            if (attributes.x === undefined || attributes.y === undefined ) {
                return false;
            }

            this.set(attributes);

            this.position = {
                x: location.x * tileSize,
                y: location.y * tileSize
            };
        }

    });

module.exports = TileModel;