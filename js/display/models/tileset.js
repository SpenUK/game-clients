'use strict';
/*jshint bitwise: false*/

var Model = require('../../extensions/model'),
    // canvasUtils = require('../../utils/canvas'),

    TilesetModel = Model.extend({

        idAttribute: 'src',

        isReady: false,

        acceptedAttributes: ['imagesCollection'],

        initialize: function() {
            this.imagesCollection = this.collection.imagesCollection;

            var imageModel = this.getImageModel();

            this._super.apply(this, arguments);

            imageModel.deferred.done(this.ready.bind(this));
        },

        getImageModel: function () {
            return this.imageModel || this.setImageModel();
        },

        setImageModel: function () {
            var src = this.get('src'),
                imageModel = this.imagesCollection.getImageModel(src);

            this.imageModel = imageModel;
            this.image = imageModel.image;

            return this.imageModel;
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
        }

    });

module.exports = TilesetModel;