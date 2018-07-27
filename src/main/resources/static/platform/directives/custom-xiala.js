(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('customXialaModule', ['platform']);

  module.directive('customXiala', ['$timeout','$compile','requestService',function($timeout,$compile,requestService) {
      return {
        restrict: 'ECMA',
        replace: true,
        scope: {
        	liArr: '=',
        	liVal: '=',
        	liLabel: '=',
        	filterShow:'=',
        	myStyle:'=',
        	liChange: '&',
        	liHide: '=',
        	dicPid:'=',
        	xlDisabled:'='
        },
		link: function(scope, element, attrs){

			var html = '<div class="dropdown"ng-style=\"myStyle\" ng-show=\"!liHide\">\
					        	<button class="btn btn-default dropdown-toggle" type="button" ng-style=\"myStyle\" style=\"overflow:hidden\" data-toggle="dropdown" ng-disabled="xlDisabled">\
					  	  {{liLabel}}\
					  	</button>\
					  	<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1" style="width:100%;height:125px;overflow:auto;">\
						  <li role="presentation"><input type=\"text\" ng-click=\"$event.stopPropagation();\" ng-show=\"filterShow\" ng-model=\"query\" class=\"form-control\" placeholder=\"过滤\"></li>\
					  	  <li role="presentation" ng-if="showInitLabel || true">\
					  		<a role="menuitem" tabindex="-1" href="javascript:void(0);" ng-click="toggleLi()">{{initLabel}}</a>\
					  	  </li>\
					  	  <li ng-repeat="x in liArr |filter:query track by $index" role="presentation" ng-if="x.oth || true">\
					  		<a role="menuitem" tabindex="-1" href="javascript:void(0);" ng-click="toggleLi(x)">{{x.key}}</a>\
					  	  </li>\
					  	</ul>\
					  </div>';
			
			// 给下拉列表数组每项添加oth属性
			for (var item in scope.liArr) {
				var source = scope.liArr[item];
				if (!source.hasOwnProperty('oth')) {
					source.oth = true;
				}
			}
			var liArr = angular.copy(scope.liArr);
			scope.$watch("liArr",function(newVal, oldVal){
				liArr = angular.copy(newVal);
			});
			function initLiArr() {
				scope.liArr = angular.copy(liArr);
			}
			if (!scope.liLabel) {
				scope.liLabel = '---请选择---';
			}
			$timeout(function(){
				var e =$compile(html)(scope);
				element.replaceWith(e);
			},1000);
            
			scope.initLabel = angular.copy(scope.liLabel);
			scope.toggleLi = function(e) {
				if (e) {
					scope.showInitLabel = true;
					scope.liLabel = e.key;
					e.oth = false;
					for (var item in scope.liArr) {
						if (e == scope.liArr[item]) {
							continue;
						}
						scope.liArr[item].oth = true;
					}
					scope.liVal = parseInt(e.value);
				} else {
					scope.showInitLabel = false;
					scope.liLabel = scope.initLabel;
					scope.liVal = null;
					initLiArr();
				}
			}
			if(scope.liVal != null){
				for (var item in scope.liArr) {
					if (scope.liVal == scope.liArr[item].value) {
						scope.liLabel = scope.liArr[item].key;
						// 默认选中的li须在下拉列表隐藏
						scope.liArr[item].oth = false;
						break;
					}				
				}
				// 显示默认选中li
				scope.showInitLabel = true;
			}
			scope.$watch("liVal",function(value,old){
				scope.liChange(scope.liVal);
			});
			scope.$on('$destroy',function(){
				
			});
		}
      };
    }
  ]);

}).call(this);
