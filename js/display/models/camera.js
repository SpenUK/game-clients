'use strict';
/*jshint bitwise: false*/

var ModelExtension = require('../../extensions/model'),

	// Camera x/y is the distance between viewport 0/0 and map 0/0
    CameraModel = ModelExtension.extend({

    	// Camera position, top/left (0,0) by default.
		x: 0,

		y: 0,

		// Will stay at 0|0 unless the map is smaller than the viewport in either dimension.
		base: {
			x: 0,
			y: 0
		},

		// distance from boundary before following.
		// setting to 50% of W and H will keep the subject in the middle
		// 25% will start the camera moving when the subject is 25% away from the edge the subject is heading to.
		// TODO - actually implement varying deadzone.
		deadzone: {
			x: 0,
			y: 0
		},

		acceptedParams: ['playerModel', 'gameModel', 'width', 'height'],

		setTarget: function (target) {
			this.target = target;
		},

		setMap: function (map) {
			var gameWidth = this.gameModel.attributes.width,
				gameHeight = this.gameModel.attributes.height,
				mapWidth = map.attributes.width * map.attributes.tilewidth,
				mapHeight = map.attributes.height * map.attributes.tileheight;

			this.map = map;

			this.base = {
				x: gameWidth - mapWidth > 0 ? (gameWidth - mapWidth) / 2 : 0,
				y: gameHeight - mapHeight > 0 ? (gameHeight - mapHeight) / 2 : 0
			};

		},

		update: function () {
			this.setPosition();
		},

		setPosition: function () {
			if (!this.map || !this.map) {
				return false;
			}

			var map = this.map,
				gameWidth = this.gameModel.attributes.width,
				gameHeight = this.gameModel.attributes.height,
				worldWidth = map.attributes.width * map.attributes.tilewidth,
				worldHeight = map.attributes.height * map.attributes.tileheight,
				targetX = (gameWidth / 2) - this.target.position.x, // center of map - player position
  				targetY = (gameHeight / 2) - this.target.position.y,

		    	inDeadzoneLeft = targetX > 0,
		    	inDeadzoneTop = targetY > 0,
		    	inDeadzoneRight = (targetX + (worldWidth - gameWidth) < 0), // is in deadzone
		    	inDeadzoneBottom = (targetY + (worldHeight - gameHeight) < 0); // is in deadzone


		    	if (worldWidth <= gameWidth || inDeadzoneLeft) {
		    		this.x = this.base.x;
		    	} else if (inDeadzoneRight) {
		    		this.x = this.base.x -(worldWidth - gameWidth);
		    	} else {
		    		this.x = targetX + this.base.x;
		    	}

		    	if (worldHeight <= gameHeight || inDeadzoneTop) {
		    		this.y = this.base.y;
		    	} else if (inDeadzoneBottom) {
		    		this.y = this.base.y -(worldHeight - gameHeight);
		    	} else {
		    		this.y = targetY + this.base.y;
		    	}

		    this.trigger('updated');
		}
    });

module.exports = CameraModel;