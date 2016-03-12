'use strict';
/*jshint bitwise: false*/

var _ = require('underscore'),
    Backbone = require('backbone'),

    CoreView = Backbone.View.extend({

        $window: $('window'),

        $body: $('body'),

        isReady: true,

        rendered: false,

        /**
         * Should be overriden with an array of accepted paramaters
         * Paramaters in this list will be set
         */
        acceptedParams: [],

        constructor: function (options) {
            this.subviewInstances = new Backbone.Collection();
            this._setAcceptedParams(options);

            Backbone.View.prototype.constructor.apply(this, arguments);
        },

        /**
         *
         */
        initialize: function () {
            this.wrapRender();
        },

        beforeRender: function () {
            this.trigger('beforeRender');
        },

        afterRender: function () {
            this.trigger('afterRender');
        },

        render: function () {
            this.rendered = false;
            this.$el.html(this.template ? this.template(this.serialize()) : '');
            this._renderSubviews();
            this._super.apply(this, arguments);
            this.rendered = true;

            return this;
        },

        wrapRender: function () {
            var self = this;

            this.render = _.wrap(this.render, function(render) {
                var args = arguments;

                self.beforeRender.apply(self,args);
                render.apply(self,args);
                self.afterRender.apply(self,args);

                return self;
            });
        },

        ready: function () {
            this.trigger('ready');
            this.isReady = true;
        },
        /**
         * Override
         */
        onReady: function () {
        },

        serialize: function () {
            return this.model ? this.model.attributes : {};
        },

        renderSubview: function () {
            this._renderSubview.apply(this, arguments);
        },

        /**
         *
         */
        _renderSubviews: function () {
            // could buffer?
            var views = _.result(this, 'views');
            _.each(views, function (viewDefinition, key) {
                this._renderSubview(viewDefinition, key);
            }, this);
        },

        _renderSubview: function (viewDefinition, key) {
            var View,
                view,
                options = {};

            viewDefinition = this._expandViewDefinition(viewDefinition);

            View = viewDefinition.View;
            options = viewDefinition.options;

            options.model = options.model || this.model || null;

            view = new View(_.extend(options, {
                el: key,
                parentView: this
            }));

            this.subviewInstances.add({
                view: view,
                key: key
            });

            debugger;

            view.listenTo(this, 'afterRender alreadyRendered', function(){
                if (view.isReady) {
                    view.render();
                } else {
                    view.listenToOnce(view, 'ready', function(){
                        view.render();
                    });
                }

                if (!view.model || view.model.isReady) {
                    view.onReady();
                } else {
                    view.listenToOnce(view.model, 'ready', view.onReady);
                }
            });

            console.log(this.rendered);

            if (this.rendered) {
                this.trigger('alreadyRendered');
            }

            this.listenTo(view, 'destroy', function(){
                this.subviewInstances[key] = null;
            });

            return view;
        },

        _removeSubviewInstances: function () {
            this.subviewInstances.each(this._removeSubviewInstance, this);
        },

        removeSubviewInstance: function () {
            this._removeSubviewInstance.apply(this, arguments);
        },

        _removeSubviewInstance: function (model) {
            if (_.isString(model)) {
                model = this.subviewInstances.findWhere({key: model});
            }

            if (model) {
                model.get('view').remove();
                model.destroy();
            }
        },


        _expandViewDefinition: function (viewDefinition) {
            var View,
                options = {};

            if (_.isObject(viewDefinition) && (viewDefinition.view || viewDefinition.View)) {
                View = viewDefinition.view || viewDefinition.View;
                options = _.result(viewDefinition, 'options') || {};

            } else if (_.isFunction(viewDefinition)) {
                View = viewDefinition;
            }

            if (!_.isFunction(View)) {
                console.log('view is not a function');
                return false;
            }

            return {
                View: View,
                options: options
            };
        },

        _coreParams: ['parent', 'app'],

        /**
         * Uses the acceptedParams array to set those params on 'this'.
         */
        _setAcceptedParams: function (options) {
            var self = this, params;
            if (!_.isArray(this.acceptedParams)) {
                return false;
            }

            params = _.union([],this._coreParams, this.acceptedParams);

            _.each(params, function(param){
              if (options[param]) {
                self[param] = options[param];
              }
            });
        }

    });

module.exports = CoreView;