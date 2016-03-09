'use strict';
/*jshint bitwise: false*/

function preloadImages(images) {
    var deferred = new $.Deferred(),
        loader = new Image(),
        total = images.length,
        count = 0;

        loader.onload = function(){
            count += 1;

            if (count === total) {
                deferred.resolve();
            } else {
                loader.src = images.pop();
            }
        };

        loader.src = images.pop();

    return deferred;
}

var ModelExtension = require('../../extensions/model'),

    MapModel = ModelExtension.extend({

        isReady: false,

        initialize: function() {
            var tileSet = this.get('tileSet'),
                loader = preloadImages([tileSet.src]);

            this._super.apply(this, arguments);

            if (loader.state() === 'resolved') {
                this.setImage();
            } else {
                loader.then(this.setImage.bind(this));
            }

        },

        setImage: function () {
            var image = new Image();

            image.src = 'images/exampleTileSet.png';
            this.set('image', image);

            this.ready();
        }
    });

module.exports = MapModel;