(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('ngLoadingModule', []);

  module.factory('ngLoadingService', ['$rootScope','$timeout', function ($rootScope,$timeout) {
	  
	  var setNgLoading = function(status){
		  $rootScope.$broadcast("ngLoading:change", status);
	  }
	  
	  return{
		  setNgLoading: setNgLoading
	  };
  }]);
  
  module.directive('ngLoading', ['$timeout',
	function($timeout) {
      return {
        restrict: 'E',
        template: '<div class="ui-loading"><i></i></div>',
        replace: true,
		link: function(scope, element, attrs){
			var timer = null;
			element.addClass("hide");
			scope.$on("ngLoading:change",function(event, data){		
				if(!data){
					if(timer) $timeout.cancel(timer);
					timer = null;
					element.addClass("hide");
				}					
				else
					timer = $timeout(function(){element.removeClass("hide");}, 500);
			});
		}
      };
    }]
  );

}).call(this);
