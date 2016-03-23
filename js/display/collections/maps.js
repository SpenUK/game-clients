'use strict';
/*jshint bitwise: false*/

var	Collection = require('../../extensions/collection'),
	MapModel = require('../models/map'),

    MapsCollection = Collection.extend({

    	model: MapModel,

    	acceptedParams: ['defaultMap', 'entitiesCollection', 'cameraModel'],

        currentMap: null,

        getCurrentMap: function () {
            return this.currentMap || this.setCurrentMap();
        },

        modelAttributes: function () {
            return {
                entitiesCollection: this.entitiesCollection
            };
        },

        setCurrentMap: function (map) {
            var currentMap;

            currentMap = this.findWhere({name: map}) || this.lastMap || this.findWhere({name: this.defaultMap});

            if (currentMap && currentMap !== this.currentMap) {
                this.lastMap = this.currentMap;
                this.currentMap = currentMap;
                this.trigger('changed:currentMap', this.currentMap);
            }

            return this.currentMap;
        }
    });

module.exports = MapsCollection;