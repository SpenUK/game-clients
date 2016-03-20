'use strict';
/*jshint bitwise: false*/

var Collection = require('../../extensions/collection'),
    Model = require('../../extensions/model'),

    LayerModel = Model.extend({

    }),

    MapsCollection = Collection.extend({

        model: LayerModel

    });

module.exports = MapsCollection;