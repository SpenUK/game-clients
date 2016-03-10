'use strict';
/*jshint bitwise: false*/

var ModelExtension = require('../../extensions/model'),

    PlayerModel = ModelExtension.extend({

    	acceptedParams: ['controlsModel', 'gameModel'],

    	initialize: function() {
            this._setPosition();

    		this._super.apply(this, arguments);

    		this.listenTo(this.controlsModel, 'direction', this.move);

            this.listenTo(this.gameModel.mapsCollection, 'changed current', function () {
                console.log('map changed...');
            });

            this.setMapModel(this.gameModel.getCurrentMap());
    	},

        setMapModel: function (model) {
            this.mapModel = model;
        },

    	move: function (direction) {
            var target = {
                x: this.get('x'),
                y: this.get('y')
            };

            if (direction === 'up') {
                target.y = target.y - 1;

            } else if (direction === 'down') {
                target.y = target.y + 1;

            } else if (direction === 'right') {
                target.x = target.x + 1;

            } else if (direction === 'left') {
                target.x = target.x - 1;

            }

            if (this.canMoveToTile(target)) {
                this.set(target);
            } else {
                console.log('hit');
            }

            // console.log(this.get('x'), this.get('y'));
    	},

        canMoveToTile: function (target) {
            console.log(target, this.get('x'), this.get('y'));
            var tileData = this.mapModel.getTileType(target);
            console.log(tileData);
            return tileData.passable;
        },

        _setPosition: function () {
            var location = this.get('location');
            this.set({
                x: location.x,
                y: location.y
            });
        }
    });

module.exports = PlayerModel;