'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var Model = require('../../extensions/model'),

    GameUIModel = Model.extend({

        initialize: function() {
            this._super.apply(this, arguments);
        }

    });

module.exports = GameUIModel;