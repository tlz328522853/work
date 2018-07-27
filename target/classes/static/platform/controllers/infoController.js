angular.module('platform').controller('infoController', ['$cookieStore','requestService','$rootScope','loginService','$http','$scope','cacheService','$location','$state',
function($cookieStore,requestService,$rootScope, loginService, $http, $scope,cacheService, $location,$state) {

	$scope.userName = $cookieStore.get("name");
	$scope.orgName = $cookieStore.get("orgName");
	
	$scope.updatePassword=function (){
		if($scope.newPassword==null||$scope.beginPassword==null||$scope.password==null){
			alert("密码和新密码不能为空！");
			return;
		}
		if($scope.newPassword.length<=0||$scope.beginPassword.length<=0||$scope.password.length<=0){
			alert("密码和新密码不能为空！");
			return;
		}
		if($scope.newPassword!=$scope.beginPassword){
			alert("新密码两次输入不一致！");
			return;
		}
		var url='/security/api/user/updatePassword';
		var param={
				name:$cookieStore.get("name"),
				password:$scope.password,
				newPassword:$scope.newPassword
		}
		 requestService.post(url, param).then(
                 function (data) {
                    alert("密码修改成功,用户已强制下线请重新登入！");
                    $state.go('login')
                    $scope.resetPanel();
                 }, function (error) {
                     $scope.resetPanel();
                 }
             );
		
	}
	
}]);
