'use strict';
/*jshint bitwise: false*/

var CollectionExtension = require('../../extensions/collection'),
    SpriteModel = require('../models/sprite'),

    EntitiesCollection = CollectionExtension.extend({

        isReady: false,

        model: SpriteModel,

        initialize: function() {
            this._super.apply(this, arguments);

            this.on('ready', this.checkReady);
        },

        checkReady: function () {
            console.log(this.allModelsAreReady(), this.length);
            if (this.allModelsAreReady()) {
                this.trigger('allReady');
                this.isReady = true;
            } else {
                this.isReady = false;
            }
        },

        allModelsAreReady: function () {
            return this.every(function (model) {
                return model.isReady;
            });
        }

    });

module.exports = EntitiesCollection;