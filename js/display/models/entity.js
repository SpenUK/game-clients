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

        update: function () {

        },

        draw: function () {
            var srcX = 0,
                srcY = 0,
                x = this.position.x,
                y = this.position.y + (this.attributes.offsetY * this.attributes.tileSize);
            // debugger;

            canvasUtils.getContext('base').drawImage(
                this.image, // image
                srcX * this.attributes.tileSize, // source x start
                srcY * this.attributes.tileSize, // source y start
                this.attributes.tileSize, // source x width
                this.attributes.tileSize * this.attributes.height, // source y height
                x, // placement x
                y, // placement y
                this.attributes.tileSize, // width
                this.attributes.tileSize * this.attributes.height // height
            );
        }

    });

module.exports = EntityModel;