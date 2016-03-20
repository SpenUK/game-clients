'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var ModelExtension = require('../../extensions/model'),
    canvasUtils = require('../../utils/canvas'),

    SpriteModel = ModelExtension.extend({

        isReady: false,

        initialize: function() {
            var src = this.get('src'),
                loader = canvasUtils.preloadImages([src]);

            this._super.apply(this, arguments);

            if (loader.state() === 'resolved') {
                console.log('sprite src already resolved');
                this.ready();
            } else {
                loader.then(this.ready.bind(this));
            }

        },

        onReady: function () {
            console.log('sprite ready', this.get('src'));
        },

        _initializePosition: function () {
            var location = this.get('location');
            this._setLocation({x: location.x, y: location.y, map: location.map});
        },

        _setLocation: function (location) {
            var tileSize = this.attributes.tileSize,
                attributes = {
                    x: location.x,
                    y: location.y
                };

            if (attributes.x === undefined || attributes.y === undefined ) {
                return false;
            }

            if (location.map) {
                attributes.map = location.map;
            }

            this.set(attributes);

            this.position = {
                x: location.x * tileSize,
                y: location.y * tileSize
            };
        }
    });

module.exports = SpriteModel;