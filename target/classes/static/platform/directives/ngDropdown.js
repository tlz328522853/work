(function() {
	  var module,
	    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  module = angular.module('ngDropdownModule', []);

	  module.directive('ngDropdownList', [
	    '$timeout','$compile', function($timeout,$compile) {
	      return {
	        restrict: 'E',
	        replace: true,
	        scope: {
	        	ngOptions:'=',
	        	itemList:'=',
	        	toCompany:'=',
	        	toHome:'=',
	        	toStat:'=',
	        	toMap:'='
	        },
			link: function(scope, element, attrs){
				
				var html ="<div class=\"btn-toolbar\"><div class=\"btn-group\">\
    				<button class=\"btn btn-warning\"  ng-click=\"titleClick(1)\">{{ngOptions.title}}</button>\
    				<button class=\"btn btn-warning dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\
    					<ul class=\"dropdown-menu\" style=\"max-height: 350px;overflow: auto;\">\
    						<li ng-if=\"toCompany == 0 \" ng-click=\"titleClick(0)\"><a class=\"pointer\"><i class=\"glyphicon glyphicon-home\"></i>返回项目公司视图</a></li>\
    						<li class=\"divider\"></li>\
			          		<li ng-show=\"toCompany == 0 \"><input type=\"text\" ng-click=\"$event.stopPropagation();\" ng-model=\"query\" class=\"form-control\" placeholder=\"过滤\"></li>\
			          		<li ng-repeat=\"item in itemList |filter:query track by $index\" ng-click=\"itemClick(item.id)\"><a class=\"pointer\">{{item.name}}</a></li>\
			          	</ul>\
    			</div></div>";
				
				scope.titleClick = function(isTitle){					
					if(scope.ngOptions && scope.ngOptions.titleClickCallback){
						scope.ngOptions.titleClickCallback(isTitle);
					}
				}
				
				scope.itemClick = function(id){
					if(scope.ngOptions && scope.ngOptions.itemClickCallback){
						scope.ngOptions.itemClickCallback(id);
					}
				}
				
	            var e =$compile(html)(scope);
	            element.replaceWith(e);
				scope.$on('$destroy',function(){
					element.remove();
					
				});
			}
	      };
	    }
	  ]);

}).call(this);


