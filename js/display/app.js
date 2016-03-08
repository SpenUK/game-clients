'use strict';

var DisplayView = require('./views/display'),

    /**
     *
     */
    App = {

        initialize: function(socket){
            console.log('app init', socket);

            socket.on('display initialize', function(a) {
                console.log(a, 'initialized');
            });

            socket.on('hi', function(a) {
                console.log(a, 'says hi!');
            });

            this.view = new DisplayView({
                el: '.display',
                socket: socket
            });

            this.view.render();
        }

    };

module.exports = App;