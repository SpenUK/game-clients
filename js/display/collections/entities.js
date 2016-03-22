'use strict';
/*jshint bitwise: false*/

var Collection = require('../../extensions/collection'),

    Entities = Collection.extend({

    	initialize: function() {
    		this._super.apply(this, arguments);
    		window.entitiesCollection = this;
    	},

    	updateEach: function () {
            this.each(function(model) {
                model.update();
            });
        },

        drawEach: function () {
    		this.each(function(model) {
    			model.draw();
    		});
    	}

    });

module.exports = Entities;