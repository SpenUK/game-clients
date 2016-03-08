'use strict';
/*jshint bitwise: false*/

var Backbone = require('backbone'),

    CoreModel = Backbone.Model.extend({

    	isReady: true,

    	onReady: function () {
    		this.isReady = true;
    		this.trigger('ready');
    	}

    });

module.exports = CoreModel;