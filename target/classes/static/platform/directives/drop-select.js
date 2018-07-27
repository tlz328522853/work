angular.module('dropSelectModule', []).directive('dropSelect', ['$timeout','$compile',function($timeout,$compile) {
      return {
        restrict: 'ECMA',
        replace: true,
        scope: {
        	liArr: '=',
        	liVal: '=',
        	liLabel: '=',
        	filterShow:'=',
        	myStyle:'=',
        	liHide: '=',
        	dicPid:'=',
        	liClean:'='
        },
		link: function(scope, element, attrs){

			var html = '<div class="dropdown"ng-style=\"myStyle\" ng-show=\"!liHide\" class="form-control" style="width:100%">\
					        	<button class="btn btn-default dropdown-toggle" title="{{liLabel}}" type="button" ng-style=\"myStyle\" style=\"overflow:hidden;width:100%;white-space: nowrap;text-overflow:ellipsis;\" data-toggle="dropdown">\
					  	  {{liLabel}}\
					  	</button>\
					  	<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1" style="width:100%;height:200px;overflow:auto;">\
						  <li role="presentation"><input type=\"text\" ng-click=\"$event.stopPropagation();\" ng-show=\"filterShow\" ng-model=\"query\" class=\"form-control\" placeholder=\"过滤\"></li>\
					  	  <li role="presentation" ng-if="showInitLabel || true">\
					  		<a role="menuitem" tabindex="-1" href="javascript:void(0);" ng-click="toggleLi()">{{initLabel}}</a>\
					  	  </li>\
					  	  <li ng-repeat="x in liArr |filter:query track by $index" role="presentation" ng-if="x.oth || true">\
					  			<input type="checkbox" class="dropInput" ng-checked="x.ck" ng-click="$event.stopPropagation();toggleLi(x);"/>\
					  			<a class="dropA" role="menuitem" tabindex="-1" href="javascript:void(0);" ng-click="$event.stopPropagation();toggleLi(x);">{{x.key}}</a>\
					  	  </li>\
					  	  <li style="width: 100%;">\
					  	  <button type="button" class="btn btn-danger" style="float:right;margin-right:10px" ng-click="selectLi(0)">清空</button>\
					  	  <button type="button" class="btn btn-primary" style="margin-right:10px;background-color: green;border-color: green;float:right" ng-click="selectLi()">确定</button></li>\
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
			var checkedArr = new Array();
			scope.selectLi = function(e){
				var selectedArr = new Array();
				if (e === 0) {
					if (checkedArr.length > 0) {
						for (var item in checkedArr) {
							delete checkedArr[item].ck;
						}
					}
					checkedArr = new Array();
					scope.liLabel = scope.initLabel;
				} else {
					if (checkedArr.length > 0) {
						var labelArr = new Array();
						for (var item in checkedArr) {
							labelArr.push(checkedArr[item].key);
							selectedArr.push(checkedArr[item].value);
						}
						scope.liLabel = labelArr.join();
					} else {
						scope.liLabel = scope.initLabel;
					}
				}
				if (selectedArr && selectedArr.length > 0) {
					scope.liVal = selectedArr.join();
				}else{
					scope.liVal = null;
				}
			}
			if (scope.liClean instanceof Object) {
				scope.liClean.invoke = function() {
					scope.selectLi(0);
				};
			}
			scope.toggleLi = function(e) {
				if (e) {
					scope.showInitLabel = true;
					e.ck = !e.ck;
					if (e.ck) {
						checkedArr.push(e);
					} else {
						for (var item in checkedArr) {
							if (checkedArr[item].key == e.key) {
								checkedArr.splice(item, 1);
							}
						}
					}
					for (var item in scope.liArr) {
						if (e == scope.liArr[item]) {
							continue;
						}
						scope.liArr[item].oth = true;
					}
//					scope.liVal = parseInt(e.value);
				} else {
					scope.showInitLabel = false;
					scope.liLabel = scope.initLabel;
//					scope.liVal = null;
					initLiArr();
				}
			
			}
			
			/*if(scope.liVal != null){
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
			}*/
			/*scope.$watch("liVal",function(value,old){
				scope.liChange(scope.liVal);
			});*/
			scope.$on('$destroy',function(){
				
			});
		}
      };
    }
  ]);