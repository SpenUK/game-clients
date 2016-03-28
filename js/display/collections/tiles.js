'use strict';
/*jshint bitwise: false*/

var CollectionExtension = require('../../extensions/collection'),
    TileModel = require('../models/tile'),

    TilesCollection = CollectionExtension.extend({

        isReady: false, // wait for all tilesets...

        model: TileModel,

        acceptedParams: ['name','entitiesCollection', 'mapModel', 'tilesetsCollection', 'imagesCollection'],

        initialize: function() {
            this._super.apply(this, arguments);

            if (this.tilesetsCollection.isReady) {
                this.ready();
            } else {
                this.listenToOnce(this.tilesetsCollection, 'allReady', this.ready);
            }
        },

        add: function () {
            this._super.apply(this, arguments);
            if (this.isReady) {
                this.matchTiles();
            } else {
                this.once('ready', this.matchTiles);
            }
        },

        checkReady: function () {
            if (this.allModelsAreReady()) {
                this.trigger('allReady');
                this.isReady = true;
            } else {
                this.isReady = false;
            }
        },

        matchTiles: function () {
            this.each(function (model) {
                model.getTileset();
            });

            this.ready();
        },

        activate: function () {
            this.entitiesCollection.add(this.models);
        },

        deactivate: function () {
            this.entitiesCollection.remove(this.models);
        },

        allModelsAreReady: function () {
            return this.every(function (model) {
                return model.isReady;
            });
        }

    });

module.exports = TilesCollection;