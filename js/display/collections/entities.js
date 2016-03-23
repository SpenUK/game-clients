'use strict';
/*jshint bitwise: false*/

var Collection = require('../../extensions/collection'),

    Entities = Collection.extend({

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