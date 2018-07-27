(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.Loading = factory(window.Zepto || window.jQuery || $);
	}
})(this, function($) {
	var Loading = function() {};
	Loading.prototype = {
		loadingTpl: '<div class="ui-loading"><i></i></div>',
		stop: function() {
			var content = $(this.target);
			this.loading.remove();
		},
		start: function() {
			var _this = this;
			var target = _this.target;
			var content = $(target);
			var loading = this.loading;
			if (!loading) {
				loading = $(_this.loadingTpl);
				$('body').append(loading);
			}
			this.loading = loading;
			var offset = $(content).offset();
			loading.css({
				top: offset.top,
				left: offset.left
			});
			var icon = loading.find('i');
			var
				top = 250,
				left = 600;
			icon.css({
				top: top,
				left: left
			})
		},
		init: function(settings) {
			settings = settings || {};
			this.loadingTpl = settings.loadingTpl || this.loadingTpl;
			this.target = settings.target || 'html';
			this.bindEvent();
		},
		bindEvent: function() {
			var _this = this;
			$(this.target).on('stop', function() {
				_this.stop();
			});
		}
	}
	return Loading;
});