'use strict';
/*jshint bitwise: false*/

var Collection = require('../../extensions/collection'),

    Entities = Collection.extend({

    	initialize: function() {
    		this._super.apply(this, arguments);
    		window.entitiesCollection = this;
    	},

    	drawEach: function () {
    		this.each(function(model) {
    			model.draw();
    		});
    	},

    });

module.exports = Entities;