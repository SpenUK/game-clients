'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var _ = require('underscore'),
    EntityModel = require('./entity'),
    // canvasUtils = require('../../utils/canvas'),

    PlayerModel = EntityModel.extend({

        isReady: false,

        isMoving: false,

        step: 4,

    	acceptedParams: ['socket', 'controlsModel', 'cameraModel', 'gameModel', 'imagesCollection'],

        keyMap: {
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down',
            '65': 'A',
            '66': 'B'
        },

        keyState: {
            left: false,
            up: false,
            right: false,
            down: false
        },

    	initialize: function() {
            _.bindAll(this, 'ready');

    		this._super.apply(this, arguments);

            var imageModel = this.getImageModel();

            imageModel.deferred.done(this.ready);

            this.direction = 2;

            if (this.map) {
                this._initializePosition();
            } else {
                this.once('mapSet', this._initializePosition);
            }

            this.listenTo(this.controlsModel, 'down', this.onControlDown);
            this.listenTo(this.controlsModel, 'up', this.onControlUp);

            this.socket.on('game:force-tile', this.onForceTile.bind(this));
    	},

        ready: function () {
            this._super.apply(this, arguments);
        },

        onControlDown: function (key) {
            key = this.keyMap[key];

            if (key) {
                this.keyState[key] = true;
            }
        },

        onControlUp: function (key) {
            key = this.keyMap[key];

            if (!key) {
                return;
            }

            this.keyState[key] = false;

            if (key === 'A') {
                this.interact();
            }

            if (key === 'B') {
                this.cancel();
            }
        },

        interact: function () {
            var targetTile = this._getNextTile(this.direction),
                occupant = this.map.getTileOccupant(targetTile),
                tileData = {
                    mapName: this.map.get('name'),
                    x: targetTile.x,
                    y: targetTile.y
                };

            if (occupant) {
                tileData.entityId = occupant.get('entityId') || 101010;
            }

            this.socket.emit('player-interaction', tileData);
        },

        cancel: function () {
            console.log('cancel');
        },

        getImageModel: function () {
            return this.imageModel || this.setImageModel();
        },

        setImageModel: function () {
            var src = this.get('spriteMap').src,
                imageModel = this.imagesCollection.getImageModel(src);

            this.imageModel = imageModel;
            this.image = imageModel.image;

            return this.imageModel;
        },

        getMap: function () {
            return this.map || this.setMap.apply(this, arguments);
        },

        setMap: function (map) {
            this.map = map;
            // set location??
            this.trigger('mapSet');
            return this.map;
        },

        onForceTile: function (tile) {
            console.log('forcing tile:', tile);
        },

    	update: function () {
            var nextTile,
                portal;

            this._setDirection();

            if (!this.isMoving && this.moveDirection) {

                nextTile = this._getNextTile(this.moveDirection);
                // not moving but wants to move
                if (nextTile && this._canMoveToTile(nextTile) && this._canMoveFromTile()) {
                    this._startMoving(nextTile, this.moveDirection);
                    this._continueMoving();
                } else {
                    // can't move - so stop to be sure.
                    this._stopMoving();
                }

            } else if (this.isMoving){
                // IS MOVING
                if (this._reachedTarget()) {
                    // No more distance to travel, so update tile position.
                    portal = this.getMap().getPortal(this.target);

                    if (portal) {
                        this._stopMoving();
                        this._moveToPortalDestination(portal.target);
                        return;
                    }

                    this._setLocation(this.target);

                    if (!this.moveDirection) {
                        // no current direction, so stop moving
                        this._stopMoving();
                        return;
                    }

                    nextTile = this._getNextTile(this.moveDirection);

                    if (this._canMoveToTile(nextTile) && this._canMoveFromTile()) {
                        this._startMoving(nextTile, this.moveDirection);
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
            this._setLocation({x: portal.x, y: portal.y, map: portal.map});
            // better to que a move?
            this.gameModel.mapsCollection.queMap(portal.map);
        },

        _canMoveToTile: function (target) {
            var targetTileCollision = this.getMap().getCollision(target),
                tileOccupied = !!_.findWhere(this.map.occupiedTiles, target);

            return !tileOccupied &&
                    !(this.moveDirection === 1 && targetTileCollision % 1000 >= 100 ||
                      this.moveDirection === 2 && targetTileCollision >= 1000       ||
                      this.moveDirection === 3 && targetTileCollision % 10 === 1    ||
                      this.moveDirection === 4 && targetTileCollision % 100 >= 10);
        },

        _canMoveFromTile: function () {
            var currentTileCollision = this.getMap().getCollision({
                x: this.attributes.x,
                y: this.attributes.y
            });

            return !(this.moveDirection === 1 && currentTileCollision >= 1000       ||
                      this.moveDirection === 2 && currentTileCollision % 1000 >= 100 ||
                      this.moveDirection === 3 && currentTileCollision % 100 >= 1000 ||
                      this.moveDirection === 4 && currentTileCollision % 10 === 1);
        },

        _getTileEvent: function () {
            return null;
        },

        _getNextTile: function (direction) {
            var target = {
                x: this.attributes.x,
                y: this.attributes.y
            };

            if (!direction) {
                return false;
            }

            // moveDirections: 1: up, 2: down, 3: left, 4: right
            if (direction === 1 && target.y > 0) {
                target.y = target.y - 1;
            // } else if (direction === 2 && target.y < map.height - 1) {
            } else if (direction === 2 && target.y < 16 - 1) {
                target.y = target.y + 1;
            } else if (direction === 3 && target.x > 0) {
                target.x = target.x - 1;
            // } else if (direction === 4 && target.x < map.width - 1) {
            } else if (direction === 4 && target.x < 16 - 1) {
                target.x = target.x + 1;
            }

            return target;
        },

        _startMoving: function(target, direction){
            this.map.occupiedTiles.push(_.extend({occupant: this}, target));

            this.target = target;
            this.direction = direction;
            this.distance = this.get('tileSize');
            this.isMoving = true;
            this.lastMove = direction;
        },

        _continueMoving: function () {
            switch(this.direction){
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
            this.moveDirection = null;
            if (this.keyState.up) { // up
                this.moveDirection = 1;
            } else if (this.keyState.down) { // down
                this.moveDirection = 2;
            } else if (this.keyState.left) { // left
                this.moveDirection = 3;
            } else if (this.keyState.right) { // right
                this.moveDirection = 4;
            }
        },

        _reachedTarget: function () {
            return this.distance <= 0;
        },

        _stopMoving: function () {
            this.moveDirection = null;
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
                    y: location.y,
                    zIndex: location.y
                };

            this.map.occupiedTiles = _.reject(this.map.occupiedTiles, function (tile) {
                return tile.occupant === this;
            }, this);

            this.map.occupiedTiles.push({
                occupant: this,
                x: location.x,
                y: location.y
            });

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