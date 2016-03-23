'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var EntityModel = require('./entity'),
    canvasUtils = require('../../utils/canvas'),

    NpcModel = EntityModel.extend({

        isReady: false,

        zIndex: 0,

        position: {
            x: 0,
            y: 0
        },

        initialize: function() {
        var src = 'images/3264player-pink.png';
        var loader = canvasUtils.preloadImages([src]);

            this.image = new Image();
            this.image.src = src;

            if (loader.state() === 'resolved') {
                this.ready();
            } else {
                loader.then(this.ready.bind(this));
            }

            this._super.apply(this, arguments);
        },

        update: function () {

        },

        draw: function () {
            var srcX = 0,
                srcY = 0,
                x = 200,
                y = 200 + (this.attributes.offsetY * this.attributes.tileSize);

            console.log(this.image);

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
            // debugger;
        }

    });

module.exports = NpcModel;