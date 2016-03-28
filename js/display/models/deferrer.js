'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
    Model = require('../../extensions/model'),

    DeferrerModel = Model.extend({

        isReady: false,

        deferred: null,

        idAttribute: 'src',

        initialize: function() {
            _.bindAll(this, 'onReady', 'ready', 'onDone');

            this.deferred = new $.Deferred(); //constructor?

            this._super.apply(this, arguments);
            this.deferred.done(this.onDone);
        },

        onDone: function () {

        }

    });

module.exports = DeferrerModel;