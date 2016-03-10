'use strict';

module.exports = function (callback) {

	/**
	 * requestAnim shim layer by Paul Irish
	 * Finds the first API that works to optimize the animation loop,
	 * otherwise defaults to setTimeout().
	 */

	console.log('requestAnimationFrame');
	window.requestAnimFrame = function(){
	 return  window.requestAnimationFrame  ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			};
	};

	if (typeof callback !== 'function') { return false; }

	(function animloop(){
	  window.requestAnimFrame(animloop);
  	callback();
	})();
};

