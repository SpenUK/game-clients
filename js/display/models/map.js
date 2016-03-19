'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var ModelExtension = require('../../extensions/model'),
    canvasUtils = require('../../utils/canvas'),

    MapModel = ModelExtension.extend({

        isReady: false,

        initialize: function() {
            var tileSet = this.get('tileSet'),
                loader = canvasUtils.preloadImages([tileSet.src]);

            this._super.apply(this, arguments);

            this.expandAttributes();

            if (loader.state() === 'resolved') {
                this.setImage();
            } else {
                loader.then(this.setImage.bind(this));
            }

        },

        setImage: function () {
            var image = new Image();

            image.src = this.get('imageSrc');
            this.set('image', image);

            this.ready();
        },

        getTileType: function (tile) {
            var tileIndex = this.getTileIndex(tile),
                tileType = this.get('tileMap')[tileIndex];

                // console.log(this.cid);

            return this.get('tileTypes')[tileType];
        },

        getTileEvent: function (tile) {
            var tileType = this.getTileType(tile);
            return this.attributes.eventTiles[tileType.event];
        },

        getTilePortal: function (tile) {

            var tileType = this.getTileType(tile);
            return this.attributes.portals[tileType.portal];
        },

        getCoords: function (tile) {
            var columns = this.get('tilesX'),
                x = tile % columns,
                y = parseInt(tile / columns);

                return {x: x, y: y};
        },

        getTileIndex: function (tile) {
            if (!tile) {
                debugger;
            }
          var x = tile.x,
              y = tile.y;

              return (y * this.get('tilesX')) + x;
        },

        expandAttributes: function () {
            var tilesX = this.get('tilesX'),
                tilesY = this.get('tilesY'),
                tileSize = this.get('tileSize'),
                width = tilesX * tileSize,
                height = tilesY * tileSize,
                imageSrc = this.get('tileSet').src;

            this.set({
                width: width,
                height: height,
                imageSrc: imageSrc
            }, {
                silent: true
            });
        }
    });

module.exports = MapModel;