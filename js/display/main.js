'use strict';

require('backbone-super');

window.BB = require('backbone');

var app = require('./app.js');

$(document).on('ready', function(){
	var socket = window.socket = window.io.connect();
	app.initialize(socket);
});