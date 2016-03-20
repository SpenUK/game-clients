'use strict';
/*jshint bitwise: false*/

var	Collection = require('../../extensions/collection'),
	Model = require('../../extensions/model'),

	ObjectLayerModel = Model.extend({

	}),

    MapsCollection = Collection.extend({

    	model: ObjectLayerModel

    });

module.exports = MapsCollection;