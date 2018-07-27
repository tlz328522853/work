angular.module('platform').controller('selectPackageController', [
	'requestService', '$scope', '$timeout', 'lgLocalDataProviderFactory', 'notifications',
	function(requestService, $scope, $timeout, lgLocalDataProviderFactory, notifications) {

		//树菜单
		var getTreeData = function() {
				
			var url = '/security/api/package/treedata';
			var param = {};     
			return requestService.post(url, param).then(function (data) {
				$scope.packageData = data.data;
			});
		};
		
		$scope.packageData = [];
		$scope.packageTree = tree = {};
		getTreeData();

		$scope.module = {};
		$scope.salesPackageId = null;
		$scope.isChike=false;
		//选中树节点
		$scope.packageSelected = function(branch){
			var param = {
				id : branch.id
			};
			$scope.salesPackageId = branch.id;
			$scope.setSale(branch.id,branch.label);
			$scope.isChike=true;
			getPage(param); 
			
		}
		
		//获取销售包下的所有模块
		var getPage = function(param){
			
			var url = '/security/api/package/getModules';
			
			requestService.post(url, param).then(
				function(data){
					$scope.dataProvider.setModel(data.data);
				},function(error){
					console.log(error);
					notifications.showWarning("error");
				}
			);
			
		}
		
		//右边表格
		$scope.dataProvider = lgLocalDataProviderFactory.create([]);
		$scope.dataProvider.limitTo(5);
		
		$scope.rowSelected = function(row){
			console.log(row.data);
		}
		$scope.showTable = true;
		
		$scope.savePackage = function() {
			$scope.closeEmpower();
		}
		
		
		
		
		
		$scope.$on('$destroy', function() {

			parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
				this.$$childTail = null;
			$scope.packageData = null;
			$scope.module = null;
			$scope.salesPackageId = null;

			console.log('function controller destroyed');

		});
	}
]);