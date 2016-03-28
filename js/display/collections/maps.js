'use strict';
/*jshint bitwise: false*/

var	Collection = require('../../extensions/collection'),
	MapModel = require('../models/map'),

    MapsCollection = Collection.extend({

    	model: MapModel,

    	acceptedParams: ['defaultMap', 'entitiesCollection', 'cameraModel', 'imagesCollection'],

        currentMap: null,

        quedMap: null,

        modelAttributes: function () {
            return {
                entitiesCollection: this.entitiesCollection
            };
        },

        queMap: function (map) {
            this.quedMap = map;
        },

        getCurrentMap: function () {
            return this.currentMap || this.setCurrentMap();
        },

        setCurrentMap: function (map) {
            var currentMap;

            currentMap = this.findWhere({name: map}) || this.lastMap || this.findWhere({name: this.defaultMap});

            if (currentMap && currentMap !== this.currentMap) {
                this.lastMap = this.currentMap;
                this.currentMap = currentMap;

                if (this.lastMap) {
                    this.lastMap.deactivate();
                }

                this.quedMap = null;

                this.trigger('changed:currentMap', this.currentMap);
            }

            return this.currentMap;
        }
    });

module.exports = MapsCollection;