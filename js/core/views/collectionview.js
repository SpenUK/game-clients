'use strict';
/*jshint bitwise: false*/
/*jshint -W087 */

var _ = require('underscore'),
    CoreView = require('./view'),
	CoreCollection = require('../collections/collection'),

    /**
     *
     */
    CollectionView = CoreView.extend({

        /**
         * Set to true to allow updates to the collection without rendering
         */
        addSilently: false,

        collectionEl: null,

    	/**
    	 * Initialises as a collection
    	 */
    	renderedItems: null,

    	/**
    	 *
    	 */
    	initialize: function(options) {
    		options = options || {};
    		this.renderedItems = new CoreCollection();
            this._super.apply(this, arguments);

            // this.listenTo(this.collection, 'add', this.renderOne);
            // this.listenTo(this.collection, 'remove', this.removeOne);

            // this.listenTo(this.collection, 'add', function() {console.log(this.renderOne);});
            // this.listenTo(this.collection, 'remove', function() {console.log(this.removeOne);});

            // this.listenTo(this.collection, 'all', function(a) {console.log(a);});
    	},

        render: function () {
            this.$el.html(this.template ? this.template(this.serialize()) : '');
            this.collectionEl = this.collectionEl ? this.collectionEl : this.el;
            this.$collectionEl = $(this.collectionEl);
            this.renderAll();

            this.stopListening(this.collection, 'add');
            this.stopListening(this.collection, 'remove');

            this.listenTo(this.collection, 'add', this.renderOne);
            this.listenTo(this.collection, 'remove', this.removeOne);

            return this;
        },

        renderAll: function () {
            return this._renderAll.apply(this, arguments);
        },

        renderSelection: function () {
            return this._renderSelection.apply(this, arguments);
        },

        renderOne: function () {
            return this._renderOne.apply(this, arguments);
        },

        renderCurrent: function () {
            this._removeAll();
            this._renderSelection(this.collection.position, 1);
        },

    	/**
    	 *
    	 */
    	_renderAll: function () {
            return this._renderSelection(0, this.collection.length);
    	},

        /**
         *
         */
        _renderSelection: function (offset, limit) {
            var ItemView = this.itemView,
                buffer = this.buffer = this.buffer || document.createDocumentFragment(),
                range = _.range(offset, offset + limit);

                this._removeAll();

            _.each(range, function (i) {
                var model = this.collection.at(i);

                if (model) {
                    var itemView = new ItemView({
                        model: model
                    });

                    buffer.appendChild(itemView.render().el);
                    this.renderedItems.add({view: itemView});
                }

            }, this);

            $(this.collectionEl).html(buffer);
        },

    	/**
    	 *
    	 */
    	// _renderOne: function (model, options) {
     //        options = options || {};
     //        var insertionMethod = options.prepend ? 'prepend' : 'append';

     //        if (this.itemView) {
     //            var itemView = new this.itemView({
     //                model: model
     //            });

     //            this[insertionMethod](itemView.render().el);
     //            this.renderedItems.add({view: itemView});

     //            return itemView;
     //        }
     //        return false;
     //    },

        _renderOne: function (model, options) {
    		options = options || {};
    		var insertionMethod = this.prepend ? '_prepend' : '_append';

    		if (this.itemView) {
    			var itemView = new this.itemView({
    				model: model
    			});

    			this[insertionMethod](itemView.render().el);
                this.renderedItems.add({view: itemView});

    			return itemView;
    		}
    		return false;
    	},

        _append: function (html) {
            this.$collectionEl.append(html);
        },

        _prepend: function (html) {
            this.$collectionEl.prepend(html);
        },

    	/**
    	 *
    	 */
    	_removeOne: function (model) {
            console.log('remove one');
    		this.renderedItems.find(model).remove();
    	},

    	/**
    	 *
    	 */
    	_removeAll: function () {
    		this.renderedItems.each(function (item) {
    			item.get('view').remove();
    		});
    	}

    });

module.exports = CollectionView;