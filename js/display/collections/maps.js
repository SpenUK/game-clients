'use strict';
/*jshint bitwise: false*/

var CollectionExtension = require('../../extensions/collection'),
    MapModel = require('../models/map'),

    MapsCollection = CollectionExtension.extend({

        acceptedParams: ['defaultMap'],

        model: MapModel,

        currentMap: null,

        initialize: function() {
            this._super.apply(this, arguments);
            this.setCurrentMap();
            window.mapsCollection = this;
        },

        getCurrentMap: function () {
            return this.currentMap || this.setCurrentMap();
        },

        setCurrentMap: function (map) {
            var currentMap;

            if (map) {
                currentMap = this.findWhere({title: map}) || this.findWhere({title: this.defaultMap});
            } else {
                currentMap = this.findWhere({title: this.defaultMap});
            }

            if (this.currentMap !== currentMap) {
                this.currentMap = currentMap;
                this.trigger('changed current', this.currentMap);
            }

            return this.currentMap;
        }
    });

module.exports = MapsCollection;