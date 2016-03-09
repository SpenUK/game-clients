'use strict';
/*jshint bitwise: false*/

var CollectionExtension = require('../../extensions/collection'),
    MapModel = require('../models/map'),

    MapsCollection = CollectionExtension.extend({

        acceptedParams: ['defaultMap'],

        model: MapModel,

        initialize: function() {
            this._super.apply(this, arguments);
            this.setCurrentMap();
        },

        setCurrentMap: function (map) {
            var currentMap;
            if (map) {
                currentMap = this.where({title: map}) || this.where({title: this.defaultMap});
            } else {
                currentMap = this.where({title: this.defaultMap});
            }

            this.currentMap = currentMap;
        }
    });

module.exports = MapsCollection;