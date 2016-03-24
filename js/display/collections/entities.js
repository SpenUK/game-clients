'use strict';
/*jshint bitwise: false*/

var Collection = require('../../extensions/collection'),

    Entities = Collection.extend({

    	updateEach: function () {
            this.each(function(model) {
                if (!model || !model.update) {
                    return;
                }
                model.update();
            });
        },

        drawEach: function () {
    		this.each(function(model) {
                if (!model || !model.draw) {
                    return;
                }
    			model.draw();
    		});
    	}

    });

module.exports = Entities;