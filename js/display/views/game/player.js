'use strict';

var ViewExtension = require('../../../extensions/view'),
	canvasUtils = require('../../../utils/canvas'),
	template = require('../../templates/game/player.hbs'),

	PlayerView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket', 'cameraModel', 'gameModel'],

		isReady: false,

		translateX: 0,

		translateY: 0,

		initialize: function() {
			var loader,
				spriteMap = this.model.get('spriteMap'),
				spriteSrc = spriteMap.src;

				console.log(spriteSrc);

			this._super.apply(this, arguments);

			loader = canvasUtils.preloadImages([spriteSrc]);

			this.image = new Image();
  			this.image.src = spriteSrc;

  			this.tileSize = this.model.get('tileSize');
  			this.spriteHeight = this.model.get('height');
  			this.spriteWidth = this.model.get('width');
  			this.offsetY = this.model.get('offsetY');

			if (loader.state() === 'resolved') {
				this.ready();
			} else {
				loader.then(this.ready.bind(this));
			}

			this.listenTo(this.model, 'change:y change:x', this.startMoving);
			this.listenTo(this.cameraModel, 'updated', this.draw);
		},

		render: function () {
			this._super.apply(this, arguments);
			this.context = canvasUtils.getContext('player');
			this.draw();
			this.gameModel.ticker.register('player-tick', this.tick.bind(this));
		},

		tick: function () {
			this.model.move();
			this.draw();
		},

		draw: function () {
			var srcX = 0,
				srcY = 0,
				x = this.model.position.x,
				y = this.model.position.y + (this.offsetY * this.tileSize);

			this.context.clearRect(0,0, this.gameModel.attributes.width, this.gameModel.attributes.height);
	    	this.context.drawImage(
		        this.image, // image
		        srcX * this.tileSize, // source x start
				srcY * this.tileSize, // source y start
				this.tileSize, // source x width
				this.tileSize * this.spriteHeight, // source y height
				x + this.cameraModel.x, // placement x
				y + this.cameraModel.y, // placement y
				this.tileSize, // width
				this.tileSize * this.spriteHeight // height
	    	);
		},

		serialize: function () {
			return {
				gameWidth: this.gameModel.get('width') + 'px',
				gameHeight: this.gameModel.get('height') + 'px'
			};
		}
	});

module.exports = PlayerView;
