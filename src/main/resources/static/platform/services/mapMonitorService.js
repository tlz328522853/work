app.service('mapMonitorService',['requestService','notifications','treeService','$q','$timeout','$state',
function(requestService,notifications,treeService,$q,$timeout,$state) {

	

	var selectedOrg = {};
	
	var orgData={};
	
	var removeItems =function(){
		orgData={};
		selectedOrg={};
	}
	var getSelectedOrg = function() {
		return selectedOrg;
	}

	var setSelectedOrg = function(sOrg) {
		selectedOrg = sOrg;
	}
	var removeSelectedOrg =function(){
		selectedOrg = {};
	}

	var getOrgsTree=function (param){
		var deferred = $q.defer();
		var url = '/security/api/organization/getMonitorOrgTree';
		if (!param) {
			param = {};
			if(!orgData.orgs){
				requestService.post(url,param, true).then(
			        function (data) {
			        	orgData.orgs = data.data;
			        	orgData.itemList = treeService.getOrg2TreeNode(data.data);
			        	deferred.resolve(orgData);
					}, function(error) {
						deferred.reject(error);
						
					}
				);
			}else{
				deferred.resolve(orgData);
			}
		}
		return deferred.promise;
	}
	
	return {
		removeSelectedOrg : removeSelectedOrg,
		getSelectedOrg : getSelectedOrg,
		setSelectedOrg : setSelectedOrg,
		getOrgsTree : getOrgsTree,
		removeItems : removeItems
	};

}]);