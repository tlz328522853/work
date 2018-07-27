angular.module('platform').controller('loginController', ['notifications','$compile','$cookieStore','$rootScope','loginService','$http','$scope','cacheService','mapMonitorService','$location','$timeout',
        function(notifications,$compile,$cookieStore,$rootScope,loginService, $http, $scope,cacheService,mapMonitorService,$location, $timeout) {
		$rootScope.token;
		$rootScope.user={};
		$scope.rememberUsr = false;
		$scope.rememberPwd = false;
		
		var checkUsr = angular.element(document.getElementById("checkUsr"));
		var checkPwd = angular.element(document.getElementById("checkPwd"));
		
		$scope.user.name = localStorage.getItem("user.name");
		$scope.user.pwd = localStorage.getItem("user.pwd");
		
		if(localStorage.getItem("user.name")){
			$scope.rememberUsr = true;
		}
		if(localStorage.getItem("user.pwd")){
			$scope.rememberUsr = true;
			$scope.rememberPwd = true;
		}
//		记住账号
	    $scope.rememberuse = function () {
	    	if($scope.rememberUsr){
	    		$scope.rememberPwd = false;
	    	}
	    	$scope.rememberUsr = !$scope.rememberUsr;
	    };
//	 	 记住密码
	    $scope.rememberpwd = function () {
	    	if($scope.rememberpwd){
	    		$scope.rememberUsr = true;
	    	}
	    	else{
	    		$scope.rememberUsr = false;
	    	}
	    	$scope.rememberPwd = !$scope.rememberPwd;
	    };
	    
		//回车登录
		$scope.enter=function(e){
			
			var e = e || event;
    		var currKey=e.keyCode;
    		
    		if($scope.user.captcha && $scope.user.captcha.length != 4)
    			return;
    		
			if (currKey == 13) {
				
				if ($scope.user.name == null) {
					notifications.showInfo("请输入用户名");
					return;
				}
				if ($scope.user.pwd == null) {
					notifications.showInfo("请输入密码");
					return;
				}
				if ($scope.user.captcha == null) {
					notifications.showInfo("请输入验证码");
					return;
				}
                $scope.login();
                
            } else {
            	return;
            }
		}
		
		var delayTime = null;
		
        $scope.login = function() {
        	if($cookieStore.get("employeeId")!=null){
        		$cookieStore.remove("employeeId");
        	}	
            if (delayTime) {
            	$timeout.cancel(delayTime);
            }
            delayTime = $timeout(function(){
            	
	        	loginService.login($scope.user.name, $scope.user.pwd, $scope.user.captcha).then(
	        		function(data) {
	        			//$http.defaults.headers.common.Authorization = 'Bearer ' + token;  
	        			if(data.code==10202){
							$rootScope.user.name=$scope.user.name;
							$cookieStore.remove("name");
							$cookieStore.put("name",$scope.user.name);
							if(data.data.token!=null){
								$rootScope.user.token=data.data.token;
								$cookieStore.remove("token");
								$cookieStore.put("token",data.data.token);
							}
							if(data.data.orgId!=null){
								$cookieStore.remove("orgId");
								$cookieStore.put("orgId",data.data.orgId);
							}
							if(data.data.orgName!=null){
								$cookieStore.remove("orgName");
								$cookieStore.put("orgName",data.data.orgName);
							}
							if(data.data.tenantId!=null){
								$cookieStore.remove("tenantId");
								$cookieStore.put("tenantId",data.data.tenantId);
							}
							if(data.data.tenantName!=null){
								$cookieStore.remove("tenantName");
								$cookieStore.put("tenantName",data.data.tenantName);
							}
							if(data.data.roleType!=null){
								$cookieStore.remove("roleType");
								$cookieStore.put("roleType",data.data.roleType);
							}
							if(data.data.isRoot!=null){
								$cookieStore.remove("isRoot");
								$cookieStore.put("isRoot",data.data.isRoot);
							}
							if(data.data.groupId!=null){
								$cookieStore.remove("groupId");
								$cookieStore.put("groupId",data.data.groupId);
							}
							if(data.data.userId!=null){
								$cookieStore.remove("userId");
								$cookieStore.put("userId",data.data.userId);
							}
							if(data.data.roles!=null){
								$cookieStore.remove("roles");
								$cookieStore.put("roles",data.data.roles);
							}
							if(data.data.topics!=null){
								$cookieStore.remove("topics");
								$cookieStore.put("topics",data.data.topics);
								
							}
							if(data.data.employee!=null){
								$cookieStore.remove("employeeId");
								$cookieStore.put("employeeId",data.data.employee);
							}
							if(data.data.employeeName!=null){
								$cookieStore.remove("employeeName");
								$cookieStore.put("employeeName",data.data.employeeName);
							}
							cacheService.removeItems();
							mapMonitorService.removeItems();
							cacheService.removeOrgs();	
							$cookieStore.remove("targetOrgId");
							//$location.path('home');
							$cookieStore.remove("10405");
							$cookieStore.remove("10406");
							$location.path('/home/home/30/map');
							$cookieStore.remove("loginUser");
							$cookieStore.put("loginUser",$rootScope.user);
						} 
						// 登录时验证码错误，则须重新刷新验证码
						else if (data.code == 10581 || data.code == 10408) {
							$scope.monitorRefresh = true;
						}
	        			//message unread count
	        			$cookieStore.remove("emailCount");
	        			$cookieStore.put("emailCount",0);
						if($rootScope.user==null){
							$rootScope.user={};
						}
						$rootScope.user.emailCount=0;
//	                	点击记住账户
	                	if($scope.rememberUsr == true){
	                		localStorage.setItem("user.name",$scope.user.name);
	                		localStorage.removeItem("user.pwd");
	                	}else{
	                		localStorage.removeItem("user.name");
	                	}
//	                	点击记住密码
	                	if($scope.rememberPwd == true){
	                		localStorage.setItem("user.name",$scope.user.name);
	                		localStorage.setItem("user.pwd",$scope.user.pwd);
	                	}else if($scope.rememberPwd != true && $scope.rememberUsr != true){
	                		localStorage.removeItem("user.name");
	                		localStorage.removeItem("user.pwd");
	                	}
	        		},
	        		function(error){
						$scope.user.pwd = '';
						// 登录时验证码错误，则须重新刷新验证码
						$scope.monitorRefresh = true;
						//$location.path('home');	
	                }
	            );
            }, 500);
        
        }
        
        $scope.$on('$destroy', function() {
        	console.log("login controller destroy!!");
        	
        	if(this.$$destroyed) return;
        	while (this.$$childHead) {
        	      this.$$childHead.$destroy();
        	}
        	var parent = this.$parent;
        	
        	$scope.rememberMe = null;
        	$scope.login = null;

        	$scope.user = null;
       	    this.$$destroyed = true;
        });
        
    } ]);
	
	
