'use strict';

require('backbone-super');

var app = require('./app.js');

$(document).on('ready', function(){
	var socket = window.socket = window.io.connect();
	app.initialize(socket);
});