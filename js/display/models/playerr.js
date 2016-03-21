'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */
var _ = require('underscore'),
    EntityModel = require('./entity'),
    canvasUtils = require('../../utils/canvas'),

    PlayerModel = EntityModel.extend({

        isReady: false,

        isMoving: false,

        step: 4,

    	acceptedParams: ['socket', 'controlsModel', 'cameraModel', 'gameModel'],

        keyMap: {
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down'
        },

        keyState: {
            left: false,
            up: false,
            right: false,
            down: false
        },

    	initialize: function() {
            var loader,
                spriteMap = this.get('spriteMap');

    		this._super.apply(this, arguments);

            this._initializePosition();

            this.listenTo(this.controlsModel, 'down', this.onControlDown);
            this.listenTo(this.controlsModel, 'up', this.onControlUp);

            // this.listenTo(this.gameModel.tiledMapsCollection, 'changed:currentMap', function (map) {
            //     this.setMapModel(map);
            // });

            loader = canvasUtils.preloadImages([spriteMap.src]);

            this.image = new Image();
            this.image.src = spriteMap.src;

            loader.then(this.ready.bind(this));

            // if (!this.mapModel) {
            //     this.setMapModel(this.gameModel.getCurrentMap());
            // }

            this.socket.on('game:force-tile', this.onForceTile.bind(this));
    	},

        // setMapModel: function (model) {
        //     console.log('set:', model);
        //     this.mapModel = model;
        //     this.trigger('changed:mapModel');
        // },

        onControlDown: function (key) {
            var direction = this.keyMap[key];
            if (direction) {
                this.keyState[direction] = true;
            }
        },

        onControlUp: function (key) {
            var direction = this.keyMap[key];
            if (direction) {
                this.keyState[direction] = false;
            }
        },

        onForceTile: function (tile) {
            console.log('forcing tile:', tile);
        },

    	update: function () {
            var nextTile,
                portal;

            this._setDirection();

            if (!this.isMoving && this.direction) {

                nextTile = this._getNextTile();
                // not moving but wants to move
                if (nextTile && this._canMoveToTile(nextTile) && this._canMoveFromTile()) {
                    this._startMoving(nextTile, this.direction);
                    this._continueMoving();
                } else {
                    // logic could be bettere, right now turing right or left on a tile portals,
                    // when only up should...
                    portal = this.mapModel.getTilePortal({
                        x: this.attributes.x,
                        y: this.attributes.y
                    });
                    if (portal) {
                        this._moveToPortalDestination(portal);
                    }
                    // can't move - so stop to be sure.
                    this._stopMoving();
                }

            } else if (this.isMoving){
                // IS MOVING
                if (this._reachedTarget()) {
                    // No more distance to travel, so update tile position.

                    // portal = this.mapModel.getTilePortal(this.target);

                    // if (portal) {
                    //     this._stopMoving();
                    //     this._moveToPortalDestination(portal);
                    //     return;
                    // }

                    this._setLocation(this.target);

                    if (!this.direction) {
                        // no current direction, so stop moving
                        this._stopMoving();
                        return;
                    }

                    nextTile = this._getNextTile();

                    if (this._canMoveToTile(nextTile) && this._canMoveFromTile()) {
                        this._startMoving(nextTile, this.direction);
                    } else {
                        this._stopMoving();
                        return;
                    }

                } else {
                    this._continueMoving();
                }
            }
    	},

        // _moveToPortalDestination: function (portal) {
        //     this._setLocation({x: portal.x, y: portal.y, map: portal.map});
        //     this.gameModel.tiledMapsCollection.setCurrentMap(portal.map);
        // },

        _canMoveToTile: function (target) {
            var targetTileCollisions = this.mapModel.getCollisions(target);

            console.log(targetTileCollisions);

            return !_.isNumber(targetTileCollisions) || !(this.direction === 1 && targetTileCollisions % 1000 >= 100 ||
                      this.direction === 2 && targetTileCollisions >= 1000       ||
                      this.direction === 3 && targetTileCollisions % 10 === 1    ||
                      this.direction === 4 && targetTileCollisions % 100 >= 10);
        },

        _canMoveFromTile: function () {
            var currentTileCollisions = this.mapModel.getCollisions({
                x: this.attributes.x,
                y: this.attributes.y
            });

            return !_.isNumber(currentTileCollisions) || !(this.direction === 1 && currentTileCollisions >= 1000       ||
                      this.direction === 2 && currentTileCollisions % 1000 >= 100 ||
                      this.direction === 3 && currentTileCollisions % 100 >= 1000 ||
                      this.direction === 4 && currentTileCollisions % 10 === 1);
        },

        _getTileEvent: function () {
            // var tileType = this.mapModel.getTileType(tile);
            return null;
        },

        _getNextTile: function () {
            var target,
                map = this.mapModel.attributes;

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
            } else if (this.direction === 2 && target.y < map.height - 1) {
                target.y = target.y + 1;
            } else if (this.direction === 3 && target.x > 0) {
                target.x = target.x - 1;
            } else if (this.direction === 4 && target.x < map.width - 1) {
                target.x = target.x + 1;
            }



            return target;
        },

        _startMoving: function(target, direction){
            this.target = target;
            this.targetDirection = direction;
            this.distance = this.get('tileSize');
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
            // directions: 1: up, 2: down, 3: left, 4: right
            // elsing to avoid diags
            // keys could be made more dynamic later by allowing the player to config their own keyboard mappings
            this.direction = null;
            if (this.keyState.up) { // up
                this.direction = 1;
            } else if (this.keyState.down) { // down
                this.direction = 2;
            } else if (this.keyState.left) { // left
                this.direction = 3;
            } else if (this.keyState.right) { // right
                this.direction = 4;
            }
        },

        _reachedTarget: function () {
            return this.distance <= 0;
        },

        _stopMoving: function () {
            this.targetDirection = null;
            this.target = null;
            this.isMoving = false;
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

module.exports = PlayerModel;