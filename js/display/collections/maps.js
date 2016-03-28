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

        // onMapChange: function () {
        //     if (this.lastMap) {
        //         console.log('deactivate', this.lastMap.get('name'));
        //         this.lastMap.deactivate();
        //     }
        //     console.log('activate', this.currentMap.get('name'));
        //     this.currentMap.activate();
        // },

        setCurrentMap: function (map) {
            var currentMap;

            currentMap = this.findWhere({name: map}) || this.lastMap || this.findWhere({name: this.defaultMap});

            if (currentMap && currentMap !== this.currentMap) {
                this.lastMap = this.currentMap;
                this.currentMap = currentMap;

                if (this.lastMap) {
                    console.log('deactivate', this.lastMap.get('name'));
                    this.lastMap.deactivate();
                }

                this.quedMap = null;

                this.trigger('changed:currentMap', this.currentMap);
            }

            return this.currentMap;
        }
    });

module.exports = MapsCollection;