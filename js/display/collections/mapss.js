'use strict';
/*jshint bitwise: false*/

var	Collection = require('../../extensions/collection'),
	MapModel = require('../models/mapp'),

    MapsCollection = Collection.extend({

    	model: MapModel,

    	acceptedParams: ['defaultMap'],

        currentMap: null,

        initialize: function() {
        	this._super.apply(this, arguments);
            console.log('mapss', this);
        	window.mapsCollection = this;
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
                this.trigger('changed:currentMap', this.currentMap);
            }

            return this.currentMap;
        }
    });

module.exports = MapsCollection;