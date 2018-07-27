(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('ngSelectCustomModule', []);

  module.directive('ngSelectCustom', ['cacheService', function(cacheService) {
      return {
        restrict: 'E',
        template: "<select class=\"select-control\" ng-change=\"changeEvent()\" ng-options=\" item.dicId as item.name for item in dicItems\"><option value=''>{{initOption}}</option></select>",
        replace: true,
        scope: {
        	dicId: '=',
        	initOption: '@',
        	changeEvent: '&'
        },
		link: function(scope, element, attrs){
			scope.dicItems = [];
			if (!scope.initOption) {
				scope.initOption = '-----请选择-----';
			}
			if(scope.dicId != undefined){
				scope.dicItems = cacheService.getDic(scope.dicId);
			}else if(attrs.dicType!= undefined){//添加字典类型名称支持
				scope.dicItems = cacheService.getDic(attrs.dicType);
			}
			else{
				scope.dicItems=[{dicId:0, name:'否'},{dicId:1, name:'是'}];
			}
			
			scope.$on('$destroy',function(){
				element.remove();
			});
			
		}
      };
    }
  ]);

}).call(this);
