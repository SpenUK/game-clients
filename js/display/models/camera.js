'use strict';
/*jshint bitwise: false*/

var ModelExtension = require('../../extensions/model'),

	// Camera x/y is the distance between viewport 0/0 and map 0/0
    CameraModel = ModelExtension.extend({

    	// Camera position, top/left (0,0) by default.
		x: 0,

		y: 0,

		// Will stay at 0|0 unless the map is smaller than the viewport in either dimension.
		// TODO - implement basing for thin/short maps.
		// if (map.pixelWidth < canvas.width) {
			// this.baseX = (canvas.width - map.pixelWidth) / 2; canvas is WIDER
		// }
		// if (map.pixelHeight < canvas.height) {
			// this.baseY = (canvas.height - map.pixelHeight) / 2; canvas is TALLER
		// }

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

		initialize: function() {
			this._super.apply(this, arguments);
			this.listenTo(this.playerModel, 'moved', this.playerMoved.bind(this));
			this.listenTo(this.playerModel, 'changed:mapModel', this.playerChangedMap.bind(this));
			this.playerChangedMap();
			window.camera = this;
		},

		playerMoved: function () {
			this.setPosition();
		},

		playerChangedMap: function () {
			var map = this.gameModel.getCurrentMap(),
				gameWidth = this.gameModel.attributes.width,
				gameHeight = this.gameModel.attributes.height,
				worldWidth = map.attributes.width * map.attributes.tilewidth,
				worldHeight = map.attributes.height * map.attributes.tileheight;

			this.base = {
				x: gameWidth - worldWidth > 0 ? (gameWidth - worldWidth) / 2 : 0,
				y: gameHeight - worldHeight > 0 ? (gameHeight - worldHeight) / 2 : 0
			};

			this.setPosition();
		},

		// follow: function(subject, deadzone) {
		// 	this.followed = subject;
		// 	if (deadzone && deadzone.x && deadzone.y) {
		// 		this.deadzone = deadzone;
		// 	}
		// },

		// update: function () {
		// 	var deadzone = this.get('deadzone'),
		// 		playerX = this.playerModel.get('x') * 32,
		// 		playerY = this.playerModel.get('y') * 32;

		// 	if (playerX - this.x + deadzone.x > this.width) {
		// 		this.x = playerX - (this.width - deadzone.x);
		// 	} else if (playerX  - deadzone.x < this.x) {
		// 		this.x = playerX  - deadzone.x;
		// 	}

		// 	if (playerY - this.y + deadzone.y > this.height) {
		// 		this.y = playerY - (this.height - deadzone.y);
		// 	} else if (playerY - deadzone.y < this.y) {
		// 		this.y = playerY - deadzone.y;
		// 	}

		// 	this.trigger('updated');
		// },

		setPosition: function () {
			var map = this.gameModel.getCurrentMap(),
				gameWidth = this.gameModel.attributes.width,
				gameHeight = this.gameModel.attributes.height,
				worldWidth = map.attributes.width * map.attributes.tilewidth,
				worldHeight = map.attributes.height * map.attributes.tileheight,
				playerX = this.playerModel.position.x,
				playerY = this.playerModel.position.y,
				targetX = (gameWidth / 2) - playerX, // center of map - player position
  				targetY = (gameHeight / 2) - playerY,

		    	inDeadzoneLeft = targetX > 0,
		    	inDeadzoneTop = targetY > 0,
		    	inDeadzoneRight = (targetX + (worldWidth - gameWidth) < 0), // is in deadzone
		    	inDeadzoneBottom = (targetY + (worldHeight - gameHeight) < 0); // is in deadzone


		    	if (worldWidth <= gameWidth || inDeadzoneLeft) {
		    		this.x = this.base.x;
		    	} else if (inDeadzoneRight) {
		    		this.x = this.base.x -(worldWidth - gameWidth);
		    		console.log(this.x);
		    	} else {
		    		this.x = targetX + this.base.x;
		    	}

		    	if (worldHeight <= gameHeight || inDeadzoneTop) {
		    		this.y = this.base.y;
		    	} else if (inDeadzoneBottom) {
		    		console.log(this.y);
		    		this.y = this.base.y -(worldHeight - gameHeight);
		    	} else {
		    		this.y = targetY + this.base.y;
		    	}

		    this.trigger('updated');
		}
    });

module.exports = CameraModel;