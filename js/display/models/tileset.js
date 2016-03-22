'use strict';
/*jshint bitwise: false*/

var Model = require('../../extensions/model'),
    canvasUtils = require('../../utils/canvas'),

    TilesetModel = Model.extend({

        idAttribute: 'src',

        isReady: false,

        initialize: function() {
            var images = [this.get('src')];

            this._super.apply(this, arguments);

            canvasUtils.preloadImages(images, this.setImage, this);
        },

        getPacket: function () {
            return this.packet || this.setPacket();
        },

        setPacket: function () {
            var columns = this.get('columns'),
                tilecount = this.get('tilecount');

            this.packet = {
                image: this.get('image'),
                width: columns,
                height: Math.floor(tilecount / columns),
                gidoffset: this.get('firstgid')
            };

            return this.packet;
        },

        setImage: function () {
            var image = new Image();

            image.src = this.get('src');

            this.set('image', image);

            this.setPacket();

            this.ready();
        }

    });

module.exports = TilesetModel;