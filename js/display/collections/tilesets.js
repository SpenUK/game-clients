'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
    Collection = require('../../extensions/collection'),
    TilesetModel = require('../models/tileset'),

    TilesetsCollection = Collection.extend({

    	model: TilesetModel,

        isReady: false,

        acceptedParams: ['imagesCollection'],

    	initialize: function() {
            _.bindAll(this, 'onResolved');

    		this._super.apply(this, arguments);

            if (this.length) {
                this.listenToDeferreds();
            }
    	},

        add: function () {
            this._super.apply(this, arguments);

            if (!this.isWaiting) {
                this.isReady = false;
                this.listenToDeferreds();
            }
        },

        getDeferreds: function () {
            return this.map(function (model) {
                return model.imageModel.deferred;
            });
        },

        listenToDeferreds: function () {
            var deferreds = this.getDeferreds();
            if (deferreds.length) {
                this.isWaiting = true;
                $.when.apply($, deferreds).then(this.onResolved);
            }
        },

        onResolved: function () {
            var deferreds = this.getDeferreds(),
                allResolved = _.every(deferreds, function (deferred) {
                    return deferred.state() === 'resolved';
                });

            if (allResolved) {
                this.ready();
            } else {
                this.listenToDeferreds();
            }
        },

        ready: function () {
            this._super.apply(this, arguments);
            this.trigger('allReady');
        }

    });

module.exports = TilesetsCollection;