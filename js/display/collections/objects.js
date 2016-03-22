'use strict';
/*jshint bitwise: false*/
// var _ = require('underscore'),
var	Collection = require('../../extensions/collection'),
	Model = require('../../extensions/model'),

	ObjectModel = Model.extend({

	}),

    ObjectsCollection = Collection.extend({

    	model: ObjectModel,

    	acceptedParams: ['entitiesCollection']

    });

module.exports = ObjectsCollection;