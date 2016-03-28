'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var ModelExtension = require('../../extensions/model'),
    canvasUtils = require('../../utils/canvas'),

    EntityModel = ModelExtension.extend({

        isReady: false,

        zIndex: 0,

        position: {
            x: 0,
            y: 0
        },

        acceptedParams: ['imagesCollection'],

        initialize: function() {

            this._super.apply(this, arguments);
        },

        _initializePosition: function () {
            this._setLocation({x: this.attributes.x, y: this.attributes.y, map: location.map});
        },

        loadSpriteMap: function () {
            var loader,
                spriteMap = this.get('spriteMap');

            if (spriteMap) {
                loader = canvasUtils.preloadImages([spriteMap.src]);
                this.image = new Image();
                this.image.src = spriteMap.src;

                return loader;
            }

            return false;
        },

        update: function () {

        },

        _setLocation: function (location) {
            this.set({
                x: location.x,
                y: location.y
            });
        },

        draw: function (context) {
            var srcX = this.attributes.sourceX || 0,
                srcY = this.attributes.sourceY || 0,
                x = this.position.x + (this.attributes.offsetX * this.attributes.tileSize),
                y = this.position.y + (this.attributes.offsetY * this.attributes.tileSize);

            context.drawImage(
                this.image || new Image(), // image
                srcX * this.attributes.tileSize, // source x start
                srcY * this.attributes.tileSize, // source y start
                this.attributes.tileSize * this.attributes.width, // source x width
                this.attributes.tileSize * this.attributes.height, // source y height
                x, // placement x
                y, // placement y
                this.attributes.tileSize * this.attributes.width, // width
                this.attributes.tileSize * this.attributes.height // height
            );
        }

    });

module.exports = EntityModel;