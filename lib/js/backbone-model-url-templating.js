/**
 * backbone-model-url-template
 *
 * Copyright (c) 2012, The Huffington Post
 * 
 * Plugin to Backbone.js to allow for model url templating.
 *
 * @version 0.1.0
 * @url http://github.com/huffingtonpost/backbone-model-url-template
 */
;(function(B, _){
	if ( !B || B.ServiceModel ) return;

	var getValue = function( model, object, prop ) {
			if (!(object && object[prop])) {
				return null;
			}
			return _.isFunction(object[prop]) ? object[prop].call(model) : object[prop];
		},
		templateSettings = {
			evaluate : /\{\#([\s\S]+?)\}/g,
			interpolate : /\{([\s\S]+?)\}/g,
			escape : /\{\%([\s\S]+?)\}/g
		};

	B.ServiceModel = B.Model.extend({
		//=====================================
		// Service calls
		//=====================================

		urls: {},

		renderURL: function ( method, options ) {
			var urlString = ( (this.urls && getValue(this, this.urls, method) || getValue(this, this, 'url') ),
				url = _.template( urlString, _.extend({}, this, this.attributes, options), templateSettings );

			return url;
		},

		sync: function ( method, model, options ) {
			var opts = _.clone(options),
				url = this.renderURL( method, opts ),
				success = options.success,
				error = options.error;

			if ( !opts['url'] ) {
				opts.url = url;
			}

			opts.success = function ( resp, status, xhr ) {
				try {
					success(resp, status, xhr);
				}
				catch (err) {
					error(err);
				}
			};

			return B.sync.call( model, method, model, opts );
		}
	});
})(this.Backbone, this._);