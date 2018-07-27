(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('customCaptchaModule', []);

  module.directive('customCaptcha', ['$compile',function($compile) {
      return {
        restrict: 'E',
        template: '<img id="captchaImg" src="/captcha?t={{timestamp}}" ng-click="refreshCaptcha()" title="点击刷新"/>',
        replace: true,
        scope: {
        	monitorVar: '='
        },
		link: function(scope, element, attrs){
			
//			var html = '<img id="captchaImg" src="/security/captcha/captcha" ng-click="refreshCaptcha()" title="点击刷新"/>';
//			var e = $compile(html)(scope);
//			element.replaceWith(e);
			
			scope.timestamp = new Date().getTime();
			scope.refreshCaptcha = function() {
				element.attr('src','');
				setTimeout(function(){element.attr('src','/captcha?t=' + new Date().getTime());},50);
			}
			
			scope.$watch("monitorVar", function(newValue) {
				if (scope.monitorVar) {
					scope.refreshCaptcha();
				}
				if (newValue) {
					scope.monitorVar = false;
				}
			});
			
			scope.$on('$destroy',function(){
				
			});
			
		}
      };
    }
  ]);

}).call(this);
