'use strict';

var ControllerView = require('./views/controller'),

    /**
     *
     */
    App = {

        initialize: function(socket){
            this.view = new ControllerView({
                el: '.controller',
                socket: socket
            });

            this.view.render();
        }

    };

module.exports = App;