'use strict';

var	ViewExtension = require('../../../extensions/view'),
	template = require('../../templates/tokeninput/tokeninput.hbs'),

	TokenInputView = ViewExtension.extend({

		template: template,

		acceptedParams: ['socket'],

		initialize: function() {
			this._super.apply(this, arguments);

			this.listenTo(this.model, 'error', this.onError);
		},

		events: {
			'submit form' : 'onSubmitForm',
			'click .submission-error .fa-close': 'onErrorClick'
		},

		onSubmitForm: function (e) {
			var code = this.$el.find('#code').val();

			this.model.setToken(code);

			e.preventDefault();
		},

		onErrorClick: function () {
			this.$el.find('form').removeClass('error');
		},

		onError: function(){
			var $form = this.$el.find('form').addClass('error');
			$form.removeClass('pending');
		}

	});

module.exports = TokenInputView;
