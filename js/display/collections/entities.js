'use strict';
/*jshint bitwise: false*/

var Collection = require('../../extensions/collection'),
    PlayerModel = require('../models/player'),

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
    	},

        removeSprites: function () {
            this.filter(function (entity) {
                return !(entity instanceof PlayerModel);
            }).each(function (entity) {
                entity.destroy();
            });
        }

    });

module.exports = Entities;