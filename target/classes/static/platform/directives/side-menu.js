(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('sideMenuModule', []);

  module.directive('sideMenu', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template: "<ul class=\"index_bot\" >\n<li ng-repeat=\"func in functions\" ng-click=\"funcClick(func, $event)\" class=\"index_botli\">\n<a class=\"tab1bj\" ng-class=\"func.icon\" ui-sref=\"{{func.url}}\" ui-sref-active=\"active\">{{func.name}}</a>\n<ul ng-class=\"func.funShow\">\n<li ng-repeat=\"subFunc in func.children\" class=\"indexli_ul_li\"><a ui-sref=\"{{subFunc.url}}\" ui-sref-active=\"active\" ng-click=\"subFuncClick(subFunc,$event)\"> <span>{{subFunc.name}}</span> </a></li>\n</ul></li></ul>",
        replace: true,
        scope: {
        	items: '=',
        	currentState:'='
        },
		link: function(scope, element, attrs){
			
			scope.icon_right_class="tab1bj";
			scope.icon_down_class="tab2bj";
			
			scope.fun_show_class="indexli_ul";
			scope.fun_hide_class="indexli_ul_hide";	
			
			//init
			scope.functions = [];
			scope.init = function(){
				for(m in scope.functions){		
					if(scope.functions[m].children != null){
						var hide = true;
						for(var item in scope.functions[m].children){
							if(scope.functions[m].children[item].url == scope.currentState){
								scope.functions[m].funShow=scope.fun_show_class;
								hide = false;
								break;
							}
						}
						if(hide)scope.functions[m].funShow=scope.fun_hide_class;
					}
					else
						scope.functions[m].funShow=scope.fun_hide_class;
					scope.functions[m].icon=scope.icon_right_class;
				}
			}
			//root function click
			scope.funcClick=function(func, $event){
				
				if(func.funShow==scope.fun_show_class){
					func.funShow=scope.fun_hide_class;
					return;
				}
				
				scope.functions.forEach(function(item){
					item.funShow = scope.fun_hide_class;
				});
				
				func.funShow=(func.funShow==scope.fun_hide_class?scope.fun_show_class:scope.fun_hide_class);
				func.icon=(func.icon==scope.icon_right_class? scope.icon_down_class:scope.icon_right_class);
			}
			
			//function click
			scope.subFuncClick=function(subFunc,$event){
				$event.stopPropagation();
			}
			
			scope.$watch('items',function(){
				scope.functions = scope.items;
				scope.init();
			});

			scope.init();
//			

			scope.$on('$destroy',function(){
				scope.$watch('items',function(){});
				scope.init = null;
				scope.funcClick = null;
				scope.subFuncClick = null;
				element.remove();
				console.log('side menu destroy!!');
				
			});
		}
      };
    }
  ]);

}).call(this);

