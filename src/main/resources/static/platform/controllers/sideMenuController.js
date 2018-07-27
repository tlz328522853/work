angular.module('platform').controller('sideMenuController',['$scope','$state','requestService','cacheService',
function($scope,$state,requestService,cacheService) {

	// add side menu
	$scope.items=[];
	$scope.stateName = $state.current.name;
	var url = '/security/api/menu/getSideMenu';
	var param = {
		id: $state.params.moduleId, 
		mark: 'MODULE_MARK'
	};
	var isLoading = true;
    cacheService.getSideMenu(url, param, isLoading).then(
    	function(result){
    		$scope.items = result[param.id];
    		
    		if($scope.stateName.lastIndexOf('home.sideMenu.') == 0) return;
    		

    		for(var i in $scope.items){
    			if($scope.items[i] && 
    					$scope.items[i].children && 
    					$scope.items[i].children.length > 0 &&
    					$scope.items[i].children[0].url){
    				$state.go($scope.items[i].children[0].url);
    				break;
    			}
    			else if($scope.items[i] && $scope.items[i].url){
    				$state.go($scope.items[i].url);
    				break;
    			}
    		}
    	}
    );
	
	$scope.$on('$destroy',function(){
		$scope.items = null;
	  	parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
	  			this.$$childTail = null;
  	});
	
}]);	