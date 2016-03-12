'use strict';
/*jshint bitwise: false*/

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

var ModelExtension = require('../../extensions/model'),

    MapModel = ModelExtension.extend({

        isReady: false,

        initialize: function() {
            var tileSet = this.get('tileSet'),
                loader = preloadImages([tileSet.src]);

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

            return this.get('tileTypes')[tileType];
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