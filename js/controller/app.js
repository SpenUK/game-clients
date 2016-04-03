'use strict';

var ControllerView = require('./views/controller'),
    ControllerModel = require('./models/controller'),

    /**
     *
     */
    App = {

        initialize: function(socket){
            this.socket = socket;
            this.view = new ControllerView({
                el: '.controller',
                socket: this.socket,
                model: this.getControllerModel()
            });
        },

        getControllerModel: function () {
            return this.controllerModel || this.setControllerModel();
        },

        setControllerModel: function () {
            var initialData = window.initialData;

            this.controllerModel = new ControllerModel({
                token: initialData.token,
                socket: this.socket
            });

            return this.controllerModel;
        }

    };

module.exports = App;