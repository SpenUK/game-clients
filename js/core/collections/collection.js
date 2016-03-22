'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
    Backbone = require('backbone'),

    CoreCollection = Backbone.Collection.extend({

        position: 0,

        status: 'initialized',

        /**
         * Should be overriden with an array of accepted paramaters
         * Paramaters in this list will be set
         */
        acceptedParams: [],

        isReady: true,

        ready: function () {
            this.trigger('ready');
            this.isReady = true;
        },
        /**
         * Override
         */
        onReady: function () {
        },

        constructor: function (models, options) {
            this._setAcceptedParams(options);

            Backbone.Collection.prototype.constructor.apply(this, arguments);
        },

        // _prepareModel: function () {
        //     var attrs = arguments[0];

        //     if (this.modelAttributes) {
        //         if (this._isModel(attrs)) {
        //             attrs.set(this.modelAttributes);
        //         } else {
        //             _.extend(attrs, _.result(this, 'modelAttributes'));
        //         }
        //     }

        //     this._super.apply(this, arguments);
        // },

    	initialize: function() {
    		this._super.apply(this, arguments);

            if (!this.isReady) {
                this.listenTo(this, 'sync', this.ready);
            }

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

module.exports = CoreCollection;