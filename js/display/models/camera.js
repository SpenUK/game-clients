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
		deadzone: {
			x: 0,
			y: 0
		},

		acceptedParams: ['playerModel', 'gameModel', 'width', 'height'],

		initialize: function() {
			this._super.apply(this, arguments);

			window.camera = this;

			this.listenTo(this.playerModel, 'change:y change:x', this.playerMoved.bind(this));
		},

		playerMoved: function () {
			this.setPosition();
		},

		follow: function(subject, deadzone) {
			this.followed = subject;
			if (deadzone && deadzone.x && deadzone.y) {
				this.deadzone = deadzone;
			}
		},

		update: function () {
			var deadzone = this.get('deadzone'),
				playerX = this.playerModel.get('x') * 50,
				playerY = this.playerModel.get('y') * 50;

			// console.log(playerX, playerY, this.x, this.y, deadzone.x, deadzone.y, this.width, this.height);

			if (playerX - this.x + deadzone.x > this.width) {
				this.x = playerX - (this.width - deadzone.x);
			} else if (playerX  - deadzone.x < this.x) {
				this.x = playerX  - deadzone.x;
			} else {
				// console.log('no x');
			}

			if (playerY - this.y + deadzone.y > this.height) {
				this.y = playerY - (this.height - deadzone.y);
			} else if (playerY - deadzone.y < this.y) {
				this.y = playerY - deadzone.y;
			} else {
				// console.log('no y');
			}

			// console.log(this.x, this.y);
			this.trigger('updated');
		},

		setPosition: function () {
			var map = this.gameModel.getCurrentMap(),
				gameWidth = this.gameModel.get('width'),
				gameHeight = this.gameModel.get('height'),
				worldWidth = map.get('width'),
				worldHeight = map.get('height'),
				playerX = this.playerModel.get('x') * 50,
				playerY = this.playerModel.get('y') * 50,
				targetX = (gameWidth / 2) - playerX, // center of map - player position
  				targetY = (gameHeight / 2) - playerY,

		    	inDeadzoneLeft = targetX > 0,
		    	inDeadzoneTop = targetY > 0,
		    	inDeadzoneRight = (targetX + (worldWidth - gameWidth) < 0), // is in deadzone
		    	inDeadzoneBottom = (targetY + (worldHeight - gameHeight) < 0), // is in deadzone

		    	inDeadzoneX = inDeadzoneLeft || inDeadzoneRight,
		    	inDeadzoneY = inDeadzoneTop || inDeadzoneBottom;

		    // if (inDeadzoneX) {
		    // 	this.x = targetX + this.base.x;
		    // } else if (inDeadzoneY) {
		    // 	this.y = targetY + this.base.y;
		    // } else {
		    // 	return;
		    // }

		    this.x = (inDeadzoneX ? this.x : (targetX + this.base.x));
		    this.y = (inDeadzoneY ? this.y : (targetY + this.base.y));

		    console.log(this.x, this.y);

		    this.trigger('updated');

		},

		forcePosition: function (x, y) {
			this.x = x;
			this.y = y;
			this.trigger('updated');
		}
    });

module.exports = CameraModel;