'use strict';
/*jshint bitwise: false*/

var DeferrerModel = require('./deferrer'),

    ImageModel = DeferrerModel.extend({

        initialize: function() {
            var src = this.get('src');
            this._super.apply(this, arguments);

            this.image = new Image();
            this.image.onload = this.onLoaded.bind(this);
            this.image.src = src;

            if (this.image.complete) {
                this.deferred.resolve();
            }
        },

        onDone: function () {
            this.ready();
        },

        onLoaded: function () {
            this.deferred.resolve();
        },

        ready: function () {
            this._super.apply(this, arguments);
        },

    });

module.exports = ImageModel;