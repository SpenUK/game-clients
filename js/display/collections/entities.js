'use strict';
/*jshint bitwise: false*/
var _ = require('underscore'),
    Collection = require('../../extensions/collection'),

    Entities = Collection.extend({

    	updateEach: function () {
            this.each(function(model) {
                if (!model || !model.update) {
                    return;
                }
                model.update();
            });
        },

        drawEach: function (context) {
            // perf hit by using underscore directly here?
            // can it be chained or even automatic?
    		_.each(this.sortBy('zIndex'), function(model) {
    			model.draw(context);
    		});
    	},

        getCids: function () {
            return this.map(function (m) {
                return m.cid;
            });
        }

    });

module.exports = Entities;