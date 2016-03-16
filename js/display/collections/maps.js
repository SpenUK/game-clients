'use strict';
/*jshint bitwise: false*/

var CollectionExtension = require('../../extensions/collection'),
    MapModel = require('../models/map'),

    MapsCollection = CollectionExtension.extend({

        acceptedParams: ['defaultMap'],

        model: MapModel,

        currentMap: null,

        getCurrentMap: function () {
            return this.currentMap || this.setCurrentMap();
        },

        setCurrentMap: function (map) {
            console.log('setCurrentMap');
            var currentMap;

            currentMap = this.findWhere({title: map}) || this.lastMap || this.findWhere({title: this.defaultMap});

            if (currentMap && currentMap !== this.currentMap) {
                this.lastMap = this.currentMap;
                this.currentMap = currentMap;
                this.trigger('changed:currentMap', this.currentMap);
            }

            return this.currentMap;
        }
    });

module.exports = MapsCollection;