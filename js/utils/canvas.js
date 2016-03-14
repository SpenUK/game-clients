'use strict';

function getCanvas(id) {
	var canvas = document.getElementById(id);
	return canvas && canvas.nodeName === 'CANVAS' ? canvas : false;
}

function getContext(id, contextType) {
	contextType = contextType || '2d';
	var canvas = getCanvas(id);
	return canvas ? canvas.getContext(contextType) : false;
}

function preloadImages(images) {
	var deferred = new $.Deferred(),
		loader = new Image(),
		total = images.length,
		count = 0;

	loader.onload = function(){
		count += 1;

		if (count === total) {
			deferred.resolve();
		} else {
			loader.src = images.pop();
		}
	};

	loader.src = images.pop();

	return deferred;
}

module.exports = {
	getContext: getContext,
	getCanvas: getCanvas,
	preloadImages: preloadImages
};