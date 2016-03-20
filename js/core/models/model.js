'use strict';
/*jshint bitwise: false*/

var Backbone = require('backbone'),
	_ = require('underscore'),

    CoreModel = Backbone.Model.extend({

    	/**
         * Should be overriden with an array of accepted paramaters
         * Paramaters in this list will be set
         */
        acceptedParams: [],

    	isReady: true,



    	ready: function () {
            this.isReady = true;
            // console.log('model ready');
            this.onReady();
            this.trigger('ready');
        },

        /**
         * Override
         */
        onReady: function () {
        },

    	constructor: function (attributes, options) {
            this._setAcceptedParams(options);

            Backbone.Model.prototype.constructor.apply(this, arguments);
        },

        _coreParams: ['parent', 'app'],

        /**
         * Uses the acceptedParams array to set those params on 'this'.
         */
        _setAcceptedParams: function (options) {
            var self = this, params;
            if (!_.isArray(this.acceptedParams) || !options) {
                return false;
            }

            params = _.union([],this._coreParams, this.acceptedParams);

            _.each(params, function(param){
              if (options[param]) {
                self[param] = options[param];
              }
            });
        }

    });

module.exports = CoreModel;