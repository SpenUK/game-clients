'use strict';

var DisplayView = require('./views/display'),

    /**
     *
     */
    App = {

        initialize: function(socket){

            this.view = new DisplayView({
                el: '.display',
                socket: socket
            });

            this.view.render();
        }

    };

module.exports = App;