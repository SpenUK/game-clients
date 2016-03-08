'use strict';
/*jshint bitwise: false*/

var Backbone = require('backbone'),

    CoreCollection = Backbone.Collection.extend({

        position: 0,

        status: 'initialized',

    	initialize: function() {
    		this._super.apply(this, arguments);

    		this.listenTo(this, 'sync', this.onReady);
    	},

    	onReady: function () {
    		this.status = 'ready';
    		this.trigger('ready');
    	},

    	isReady: function () {
    		return this.status === 'ready';
    	}
    });

module.exports = CoreCollection;