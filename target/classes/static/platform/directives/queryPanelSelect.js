angular.module('queryPanelSelect', [])
.directive('qryItem', ['requestService',function(requestService){
	return {
		restrict: 'EACM',
		replace: true,
		template: '<ng-select-custom dic-id="typeDic" ng-model="typeDicQry"/>',
		scope: {
			typeDic: '=',
			typeDicQry: '&'
		},
		link: function(scope, element, attrs) {
			
		}
		
	};
}]);