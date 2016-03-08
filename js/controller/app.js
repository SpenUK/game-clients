'use strict';

var ControllerView = require('./views/controller'),

    /**
     *
     */
    App = {

        initialize: function(socket){
            console.log('app init', socket);

            socket.on('controller initialize', function(a) {
                console.log(a, 'initialized');
            });

            socket.on('hi', function(a) {
                console.log(a, 'says hi!');
            });


            this.view = new ControllerView({
                el: '.controller',
                socket: socket
            });

            this.view.render();
        }

    };

module.exports = App;