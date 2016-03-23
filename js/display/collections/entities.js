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

        // removeSprites: function () {
        //     var filtered = this.filter(function (entity) {
        //         return !(entity instanceof PlayerModel);
        //     });

        //     _.each(filtered, function (entity) {
        //         entity.destroy();
        //     });
        // }

    });

module.exports = Entities;