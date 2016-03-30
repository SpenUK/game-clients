'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */
var _ = require('underscore'),
    EntityModel = require('./entity'),

    NpcModel = EntityModel.extend({

        isReady: false,

        step: 1,

        moveWaitTime: 0,

        acceptedParams: ['map'],

        initialize: function() {
            _.bindAll(this, 'ready');
            this.setRandomWaitTime();
            this._initializePosition();
            this._super.apply(this, arguments);

            var loader = this.loadSpriteMap();

            if (loader) {
                loader.then(this.ready);
            }
        },

        setRandomWaitTime: function () {
            this.moveWaitTime = _.random(1000, 5000);
        },

        update: function () {
            var nextTile;

            this._setDirection();

            if (!this.isMoving && this.direction) {

                nextTile = this._getNextTile();
                // not moving but wants to move
                if (nextTile && this._canMoveToTile(nextTile) && this._canMoveFromTile()) {
                    this._startMoving(nextTile, this.direction);
                    this._continueMoving();
                } else {
                    // can't move - so stop to be sure.
                    this._stopMoving();
                }

            } else if (this.isMoving){
                // IS MOVING
                if (this._reachedTarget()) {
                    this._setLocation(this.target);
                    this._stopMoving();

                } else {
                    this._continueMoving();
                }
            } else {
                this.moveWaitTime -= 10;
            }
        },

        getMap: function () {
            return this.map || this.setMap.apply(this, arguments);
        },

        setMap: function (map) {
            this.map = map;
            this.map.occupiedTiles.push({x: this.attributes.x, y: this.attributes.y});

            return this.map;
        },

        _canMoveToTile: function (target) {
            var targetTileCollision = this.getMap().getCollision(target),
            // directions: 1: up, 2: down, 3: left, 4: right
                tileOccupied = !!_.findWhere(this.map.occupiedTiles, target),
                passable = !(this.direction === 1 && targetTileCollision % 1000 >= 100 ||
                      this.direction === 2 && targetTileCollision >= 1000       ||
                      this.direction === 3 && targetTileCollision % 10 === 1    ||
                      this.direction === 4 && targetTileCollision % 100 >= 10);

            return !tileOccupied && passable;
        },

        _canMoveFromTile: function () {
            var currentTileCollision = this.getMap().getCollision({
                x: this.attributes.x,
                y: this.attributes.y
            });

            return !(this.direction === 1 && currentTileCollision >= 1000       ||
                      this.direction === 2 && currentTileCollision % 1000 >= 100 ||
                      this.direction === 3 && currentTileCollision % 100 >= 1000 ||
                      this.direction === 4 && currentTileCollision % 10 === 1);
        },

        _getNextTile: function () {
            var target;

            if (!this.direction) {
                return false;
            }

            target = {
                x: this.attributes.x,
                y: this.attributes.y
            };

            // directions: 1: up, 2: down, 3: left, 4: right
            if (this.direction === 1 && target.y > 0) {
                target.y = target.y - 1;
            // } else if (this.direction === 2 && target.y < map.height - 1) {

            } else if (this.direction === 2 && target.y < 16 - 1) {
                target.y = target.y + 1;
            } else if (this.direction === 3 && target.x > 0) {
                target.x = target.x - 1;
            // } else if (this.direction === 4 && target.x < map.width - 1) {
            } else if (this.direction === 4 && target.x < 16 - 1) {
                target.x = target.x + 1;
            }

            return target;
        },

        _startMoving: function(target, direction){
            this.map.occupiedTiles.push(target);
            this.target = target;
            this.targetDirection = direction;
            this.distance = 32;
            this.isMoving = true;
            this.lastMove = direction;
        },

        _continueMoving: function () {
            switch(this.targetDirection){
              case 1:
                this.distance -= this.step;
                this.position.y -= this.step;
                break;
              case 2:
                this.distance -= this.step;
                this.position.y += this.step;
                break;
              case 3:
                this.distance -= this.step;
                this.position.x -= this.step;
                break;
              case 4:
                this.distance -= this.step;
                this.position.x += this.step;
                break;
            }
            this.trigger('moved');
        },

        _setDirection: function () {
            var randomNumber = _.random(0, 100),
                shouldMove = this.moveWaitTime <= 1000 && randomNumber <= 10;

            this.direction = null;

            if (shouldMove) {
                this.direction = _.sample([1,2,3,4]);
            }
        },

        _reachedTarget: function () {
            return this.distance <= 0;
        },

        _stopMoving: function () {
            this.setRandomWaitTime();
            this.targetDirection = null;
            this.target = null;
            this.isMoving = false;
        },

        _setLocation: function (location) {
            var tileSize = 32,
                current = {
                    x: this.attributes.x,
                    y: this.attributes.y
                },
                attributes = {
                    x: location.x,
                    y: location.y,
                    zIndex: location.y
                };

            if (attributes.x === undefined || attributes.y === undefined ) {
                return false;
            }

            this.map.occupiedTiles = _.without(this.map.occupiedTiles, _.findWhere(this.map.occupiedTiles, current)); // better way

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

module.exports = NpcModel;