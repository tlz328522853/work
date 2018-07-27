angular.module('platform').controller('homeController', ['$cookieStore','$timeout','$scope','$state','requestService','loginService','$rootScope','cacheService','notifications','$location',function($cookieStore,$timeout,$scope,$state,requestService,loginService,$rootScope,cacheService,notifications,$location) {
	// add top menu
	
	$scope.menuData = [];
	
	if($rootScope.user==null){
		$rootScope.user=$cookieStore.get("loginUser");
		if($rootScope.user==null)
			$location.path('/login');
	}
	$rootScope.user.name=$cookieStore.get("name");
	if($cookieStore.get("orgName")!=null){
		$rootScope.user.orgName=$cookieStore.get("orgName");
	}
	if($cookieStore.get("orgId")!=null){
		$rootScope.user.orgId=$cookieStore.get("orgId");
	}
	
	if($cookieStore.get("roleType")==1){
		$rootScope.user.roleType="业务员";
	}
	if($cookieStore.get("roleType")==2){
		$rootScope.user.roleType="公司管理员";
	}
	if($cookieStore.get("roleType")==3){
		$rootScope.user.roleType="住户管理员";
	}
	if($cookieStore.get("roleType")==4){
		$rootScope.user.roleType="平台管理员";
	}
	var getModules = function(){
		requestService.post('/security/api/menu/getTopMenu',{}).then(
				function(data){
					$scope.menuData = data.data;
				}
		);
	};
	$scope.loginout = function(name,token){
		
		loginService.loginout(name,token).then(
        		function(token) {
					if(token==null){
						alert("用户名错误");
					}else{
						$cookieStore.remove("token");
						$cookieStore.remove("name");
						$cookieStore.remove("token");
						$cookieStore.remove("orgId");
						$cookieStore.remove("orgName");
						$cookieStore.remove("roleType");
						$cookieStore.remove("isRoot");
						$cookieStore.remove("groupId");
						$cookieStore.remove("roles");
						$cookieStore.remove("userId");
						cacheService.removeItems();
						$state.go('login');
					}
        		},
        		function(error){
					$scope.user.pwd = '';
					//$location.path('home');	
                }
        	);
        }
	
	getModules();

	$scope.$on('$destroy',function(){
		
		$scope.menuData = null;
		
	  	parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
	  			this.$$childTail = null;
	  	
  		console.log('home controller destroyed');
  	});
	
	//提示框
	$scope.showError = function () {
		notifications.showError('Oops! Something bad just happend!');
	};

	$scope.showWarning = function () {
		notifications.showWarning('Hey! Take a look <em>here<em>..');
	};

	$scope.showSuccess = function () {
		notifications.showSuccess('Congrats! Life is great!');
	};
	var toics=new Array();
	toics.push($cookieStore.get("groupId")+'');
	toics.push($cookieStore.get("userId")+'');
	var client;
	
	// Create a client instance
	client = new Paho.MQTT.Client("192.168.2.225", Number("1884"), $cookieStore.get("token"));

	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	// connect the client
	client.connect({onSuccess:onConnect});


	// called when the client connects
	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  console.log("onConnect");
	  var c=$cookieStore.get("topics");
	 //client.subscribe($cookieStore.get("topics")+'');
	  angular.forEach($cookieStore.get("topics"), function(data,index,array){
		  //data等价于array[index]
		  client.subscribe(data+'');
		  });
	  requestService.post('/security/api/message/unread',{'userId':$cookieStore.get("userId")}).then(
				function(data){
					if($rootScope.user.emailCount<data.data){
						notifications.showSuccess("你有新的消息！");
						$rootScope.user.emailCount=data.data;
						$cookieStore.remove("loginUser")
						$cookieStore.put("loginUser",$rootScope.user);
					}
					
				}
		);
	 /* message = new Paho.MQTT.Message("Hello");
	  message.destinationName = $cookieStore.get("userId")+'';
	  client.send(message);*/
	}
	
	//获取公司信息
	$(function(){
		var getPage = function(curPage, pageSize, sort) {
			var url = '/security/api/tenant/getTenantById';
			var param={};
			requestService.post(url, param).then(function(data) {
				$scope.com = data.data;
			});
		};
		
		getPage();
	});

	// called when the client loses its connection
	function onConnectionLost(responseObject) {
		$timeout(
                function() {
                	client.connect({onSuccess:onConnect,onFailure:onFailure});
                },
                30000
            );
		
	  if (responseObject.errorCode !== 0) {
	    console.log("onConnectionLost:"+responseObject.errorMessage);
	  }
	}
	function onFailure(errorCode){
		console.log("errorCode:"+errorCode);
		$timeout(
                function() {
                	client.connect({onSuccess:onConnect,onFailure:onFailure});
                },
                30000
            );
		
	}
	//消息重新订阅
	function restSubscribe(){
		var url = '/security/api/topic/getUserTopics';
		var param={};
		param.userId=$cookieStore.get("userId");
		requestService.post(url, param).then(function(data) {
			var newTopics= data.data;
			//去除原来的订阅
			angular.forEach($cookieStore.get("topics"), function(data,index,array){
				  //data等价于array[index]
				  client.unsubscribe(data+'');
				  });
			//从新订阅新的消息
			angular.forEach(newTopics, function(data,index,array){
				  //data等价于array[index]
				client.subscribe(data+'');
				  });
			$cookieStore.remove("topics");
			$cookieStore.put("topics",newTopics);
		});
		 //client.subscribe($cookieStore.get("topics")+'');
		 
	}
	// called when a message arrives
	function onMessageArrived(message) {
		if(message.payloadString=="400"){
			requestService.post('/security/api/message/unread',{'userId':$cookieStore.get("userId")}).then(
					function(data){
						notifications.showSuccess("你有新的消息！");
						$rootScope.user.emailCount=data.data;
						$cookieStore.remove("loginUser")
						$cookieStore.put("loginUser",$rootScope.user);
					}
			);
			
		}else{
			$(".mar_q").html(message.payloadString);
			$(".mar_q").animate({"right":"100%"},10000,function(){
				
				$(this).css("right","-300px");
				$("div.indexbox").css("height","-webkit-calc(100% - 20px)");
				$(this).animate({"right":"100%"},15000,function(){
					$("div").remove(".marquee");
					$("div.indexbox").css("height","100%");
					$(".sidemenu").css({position:"absolute",top:"205px"});
				 }) 
			})
		}
		//消息从新订阅
		if(message.payloadString=="300"){
			restSubscribe();
		}
	  console.log("onMessageArrived:"+message.payloadString);
	}
	$scope.openIE = function () {
		
		const IE_PATH = "C:\\Program Files\\Internet Explorer\\iexplore.exe";
		var file = chrome.Cc["@mozilla.org/file/local;1"].createInstance(chrome.Ci.nsILocalFile);
		file.initWithPath(IE_PATH);
		if (!file.exists()) {
		  alert("文件不存在: " + IE_PATH);
		  return;
		}
		var process = chrome.Cc["@mozilla.org/process/util;1"].createInstance(chrome.Ci.nsIProcess);
		try {
		  var args = [window.content.location.href,"-private"];
		  process.init(file);
		  process.run(false, args, args.length);
		}
		catch (ex) {
		  alert("无法执行: " + IE_PATH);
		}
	};
	$scope.closeAll = function () {
		notifications.closeAll();
	};
	//编辑框
	$scope.data = {
        text: "hello"
    }
    $scope.disabled = false;
    $scope.menu = [
        ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
        ['format-block'],
        ['font'],
        ['font-size'],
        ['font-color', 'hilite-color'],
        ['remove-format'],
        ['ordered-list', 'unordered-list', 'outdent', 'indent'],
        ['left-justify', 'center-justify', 'right-justify'],
        ['code', 'quote', 'paragraph'],
        ['link', 'image'],
        ['css-class']
    ];

    $scope.cssClasses = ['test1', 'test2'];
	return;
}]);	