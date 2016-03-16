'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var ModelExtension = require('../../extensions/model'),
    canvasUtils = require('../../utils/canvas'),
    PlayerModel = ModelExtension.extend({

        isMoving: false,

        step: 4,

    	acceptedParams: ['controlsModel', 'gameModel'],

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

            this.listenTo(this.gameModel.mapsCollection, 'changed:currentMap', function (map) {
                this.setMapModel(map);
            });

            loader = canvasUtils.preloadImages([spriteMap.src]);

            this.image = new Image();
            this.image.src = spriteMap.src;

            if (loader.state() === 'resolved') {
                this.ready();
            } else {
                loader.then(this.ready.bind(this));
            }

            if (!this.mapModel) {
                this.setMapModel(this.gameModel.getCurrentMap());
            }

            this.move();
    	},

        setMapModel: function (model) {
            console.log('set:', model);
            this.mapModel = model;
            this.trigger('changed:mapModel');
        },

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

    	move: function () {
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
                    // can't move - so stop to be sure.
                    this._stopMoving();
                }

            } else if (this.isMoving){
                // IS MOVING
                if (this._reachedTarget()) {
                    // No more distance to travel, so update tile position.

                    this.set(this.target);

                    portal = this.mapModel.getTilePortal(this.target);

                    if (portal) {
                        this._stopMoving();
                        this._moveToPortalDestination(portal);
                        return;
                    }

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

        _moveToPortalDestination: function (portal) {
            this._setLocation(portal.x, portal.y, portal.map);
            this.gameModel.mapsCollection.setCurrentMap(portal.map);
        },

        _canMoveToTile: function (target) {
            // var targetTile = this.mapModel.getTileType(target);
            var targetTile = this.gameModel.mapsCollection.currentMap.getTileType(target);

            return targetTile &&
                    !(this.direction === 1 && targetTile.blocker % 1000 >= 100 ||
                      this.direction === 2 && targetTile.blocker >= 1000       ||
                      this.direction === 3 && targetTile.blocker % 10 === 1    ||
                      this.direction === 4 && targetTile.blocker % 100 >= 10);
        },

        _canMoveFromTile: function () {
            var currentTile = this.gameModel.mapsCollection.currentMap.getTileType({
                x: this.attributes.x,
                y: this.attributes.y
            });

            return currentTile &&
                    !(this.direction === 1 && currentTile.blocker >= 1000       ||
                      this.direction === 2 && currentTile.blocker % 1000 >= 100 ||
                      this.direction === 3 && currentTile.blocker % 100 >= 1000 ||
                      this.direction === 4 && currentTile.blocker % 10 === 1);
        },

        _getTileEvent: function (tile) {
            var tileType = this.gameModel.mapsCollection.currentMap.getTileType(tile);
            return tileType.event;
        },

        _getNextTile: function () {
            var target,
                map = this.gameModel.mapsCollection.currentMap.attributes;

            if (!this.direction) {
                return false;
            }

            target = {
                x: this.get('x'),
                y: this.get('y')
            };

            // directions: 1: up, 2: down, 3: left, 4: right
            console.log(target.y > 0, target.x > 0, target.y < map.tilesY -1, target.x < map.tilesX -1);

            if (this.direction === 1 && target.y > 0) {
                target.y = target.y - 1;
            } else if (this.direction === 2 && target.y < map.tilesY - 1) {
                target.y = target.y + 1;
            } else if (this.direction === 3 && target.x > 0) {
                target.x = target.x - 1;
            } else if (this.direction === 4 && target.x < map.tilesX - 1) {
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
            this._setLocation(location.x, location.y, location.map);
        },

        _setLocation: function (x, y, map) {
            var tileSize = this.get('tileSize');
            this.set({
                x: x,
                y: y,
                map: map
            });

            this.position = {
                x: x * tileSize,
                y: y * tileSize
            };
        }
    });

module.exports = PlayerModel;