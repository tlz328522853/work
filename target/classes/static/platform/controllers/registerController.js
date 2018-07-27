angular.module('platform').controller('registerController', ['ngLoadingService','requestService','ngDialog','$scope','$location','notifications','$state',
        function(ngLoadingService,requestService,ngDialog,$scope, $location,notifications,$state) {
	$scope.saleId=1;
	$scope.saleName="";
	$scope.ngdialog={};
	$scope.tenant={name:"",
			telephone:"",
			address:"",
			description:"",
			applicant:"",
			applicantMobile:""};
	
	$scope.user = {
			name:"",
			password:"",
			email:"",
			userType:0
	};
	$scope.qryFlag = true;
	$scope._checked = true;
	$scope.submit = function(registerForm){
		$scope._checked = true;
		if(!registerForm.$valid){
			alert("请输入正确的参数");
			return;
		}	
		var url = '/security/regist';
		if($scope.user.password==null||$scope.user.password.length<=0){
			alert("请输入用户登入密码!");
			return;
		}
		if($scope.pwd2==null||$scope.pwd2.length<=0||$scope.pwd2!=$scope.user.password){
			alert("两次输入密码不一致!");
			return;
		}
		para = {//tenant
					'tenantName':$scope.tenant.name,
					'telephone':$scope.tenant.telephone,
					'address':$scope.tenant.address,
					'description':$scope.tenant.description,
					'applicant':$scope.tenant.applicant,
					'applicantMobile':$scope.tenant.applicantMobile,
					'saleId':$scope.saleId,
					'userName':$scope.user.name,
					'password':$scope.user.password,
					'email':$scope.user.email};
		ngLoadingService.setNgLoading(true);
		requestService.post(url, para).then(
					
				function(data){//success
					ngLoadingService.setNgLoading(false);
					if(data.code==10202){
						alert("注册成功！即将进入登入页面!");
						$state.go('login')
					}
				},
				function(data){//error
					ngLoadingService.setNgLoading(false);
					 if(data.code==10409){
						notifications.showError("用户名已经注册");
					}else if(data.code==10505){
						notifications.showError("系统繁忙稍后尝试！");	
					}else{
						
					}
				});
		}
		
	console.log('register');
	$scope.$on('$destroy',function(){
		parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
			   this.$$childTail = null;
		console.log('register controller destroyed');
	})
	$scope.showEmpower = function(){
		$scope.ngdialog=ngDialog.open({
		    template: 'platform/html/selectpackage.html',
		    className: 'ngdialog-theme-plain',	
			width:'82%',
			height:'470px',
			scope:$scope,
		    controller: 'selectPackageController'
		});
		 requestService.setNgDialog($scope.ngdialog);
	}
	 $scope.setSale=function(id,name){
		 $scope.saleId=id;
		 $scope.saleName=name;
	 }
    $scope.closeEmpower=function(){
    	$scope.ngdialog.close(true);
    }
    
    }
]);