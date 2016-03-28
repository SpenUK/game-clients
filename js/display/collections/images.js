'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
    Collection = require('../../extensions/collection'),
    ImageModel = require('../models/image'),

    ImagesCollection = Collection.extend({

        isReady: false,

    	model: ImageModel,

        initialize: function() {
            _.bindAll(this, 'onResolved');

            this._super.apply(this, arguments);

            this.listenToDeferreds();
        },

        getImageModel: function (src) {
            var imageModel = this.findWhere({src: src});
            if (imageModel) {
                return imageModel;
            }

            imageModel = new this.model({
                src: src
            });

            this.add(imageModel);

            return imageModel;
        },

        add: function () {
            if (!this.isWaiting) {
                this.isReady = false;
                this.listenToDeferreds();
            }

            this._super.apply(this, arguments);
        },

        getDeferreds: function () {
            return this.map(function (model) {
                return model.deferred;
            });
        },

        listenToDeferreds: function () {
            var deferreds = this.getDeferreds();
            if (deferreds.length) {
                this.isWaiting = true;
                $.when.apply($, deferreds).then(this.onResolved);
            }
        },

        onResolved: function () {
            var deferreds = this.getDeferreds(),
                allResolved = _.every(deferreds, function (deferred) {
                    return deferred.state() === 'resolved';
                });

            if (allResolved) {
                this.ready();
            } else {
                this.listenToDeferreds();
            }
        },

        ready: function () {
            this.isWaiting = false;
            this.isReady = true;
            this.trigger('allReady');
        },

    });

module.exports = ImagesCollection;