'use strict';
/*jshint bitwise: false*/
var _ = require('underscore'),
	Collection = require('../../extensions/collection'),
	Model = require('../../extensions/model'),
	NpcModel = require('../models/npc'),

	entityDataMap = {
		'npc-1' : {
			name: 'npc-1',
			spriteMap: {
				src: 'images/3264player-green.png',
				tilesX: 1,
				tilesY: 2,
				tileSize: 32,
				height: 64,
				width: 32
			},
			tileSize: 32,
			height: 2,
			width: 1,
			offsetY: - 1,
			offsetX: 0,
			behaviours: [
				'wanderer'
			]
		},
		'npc-2' : {
			name: 'npc-2',
			spriteMap: {
				src: 'images/3264player-pink.png',
				tilesX: 1,
				tilesY: 2,
				tileSize: 32,
				height: 64,
				width: 32
			},
			height: 2,
			width: 1,
			tileSize: 32,
			offsetY: - 1,
			offsetX: 0,
			behaviours: [
				'vendor'
			]
		}
	},

	ObjectModel = Model.extend({

		initialize: function() {
			this._super.apply(this, arguments);
			this.setEntityModel();
		},

		assignBehaviours: function () {
			// console.log(this);
		},

		getEntityModel: function () {
			return this.entityModel || this.setEntityModel();
		},

		setEntityModel: function () {
			var entityData = this.getEntityData(this.get('name')),
				mapModel = this.collection.mapModel;

			if (entityData) {
				this.entityModel = new NpcModel(_.extend({}, entityData,
					this.attributes
				));

				this.entityModel.setMap(mapModel);
			}

			return this.entityModel;
		},

		getEntityData: function (name) {
			var data = entityDataMap[name];
			return data;
		},

		destroy: function () {
			if (this.entityModel) {
				this.entityModel.detroy();
			}

			this._super.apply(this, arguments);
		},
	}),

    ObjectsCollection = Collection.extend({

    	model: ObjectModel,

    	acceptedParams: ['entitiesCollection', 'mapModel'],

    	activate: function () {
    		var entities = this.getEntities();
    		this.entitiesCollection.add(entities);
    	},

    	deactivate: function () {
    		this.entitiesCollection.remove(this.getEntities());
    	},

    	getEntities: function () {
    		return this.entities || this.setEntities();
    	},

    	setEntities: function () {
    		this.entities = this.map(function (object) {
    			return object.entityModel;
    		});

    		return this.entities;
    	}

    });

module.exports = ObjectsCollection;