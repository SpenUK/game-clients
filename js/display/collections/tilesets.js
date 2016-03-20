'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
    Collection = require('../../extensions/collection'),
    TilesetModel = require('../models/tileset'),

    TilesetsCollection = Collection.extend({

    	model: TilesetModel,

        isReady: false,

    	initialize: function() {
    		this._super.apply(this, arguments);
            this.on('ready', this.checkReady);

            _ = _;
    	},

        // getTilesetModels: function (tilesets) {
        //     var tilesetSrcs = _.map(tilesets, function (tilesetData) {
        //         return tilesetData.src;
        //     });

        //     this.add(tilesets);

        //     return this.filter(function (model) {
        //         return _.contains(tilesetSrcs, model.get('src'));
        //     });
        // },

        // loadTilesets: function (images, callback, context) {
        //     return canvasUtils.preloadImages(images, callback, context);
        // },

        checkReady: function () {
            console.log(this.allModelsAreReady(), this.length);
            if (this.allModelsAreReady()) {
                this.trigger('allReady');
                this.isReady = true;
            } else {
                this.isReady = false;
            }
        },

        allModelsAreReady: function () {
            return this.every(function (model) {
                return model.isReady;
            });
        }

    });

module.exports = TilesetsCollection;