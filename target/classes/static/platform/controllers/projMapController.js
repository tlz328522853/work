angular.module('platform').controller('projMapController', ['$scope','$timeout','ngDialog','$q','lgLocalDataProviderFactory','$location','requestService','mapMonitorService','notifications','cacheService','$cookieStore','$state',
	function( $scope, $timeout,ngDialog,$q,lgLocalDataProviderFactory,$location,requestService,mapMonitorService,notifications,cacheService,$cookieStore,$state) {
	//地图----------------------开始---------------------------
    //初始化地图	
	var map = new BMap.Map(document.getElementById("map_qb"),{enableMapClick:false});	
	var longitude = 116.404;
	var latitude = 39.915;
	var zoom = 7;
	map.centerAndZoom(new BMap.Point(longitude, latitude), zoom);
	map.enableScrollWheelZoom();
	map.enableInertialDragging();
	map.enableContinuousZoom();
	//map.setMapStyle(cacheService.getMapStyle());
	//组建项目公司显示样式
	var createProjHtml = function(name){
		
		return '<div style="position: absolute; margin: 0pt; padding: 0pt; width: 19px; height: 25px; left: -9px; top: -20px; overflow: hidden;">'
		+'<img id="rm3_image" style="border:none;left:0px; top:0px; position:absolute;" src="img/tk_zuobiao_huanwei.png">'
		+'</div>'
		+'<label class=" BMapLabel" unselectable="on" style="position: absolute; -moz-user-select: none; display: inline; cursor: inherit; border: 0px none; padding: 2px 1px 1px; white-space: nowrap; font: 15px arial,simsun; z-index: 80; color: rgb(255, 255, 255); left: 15px; top: -20px; background:orange;">'+name+'</label>';
	}
	
	//项目公司
	var projCompanyMarkerMap = {}; 
	var projCompanyPositionList = [];
	var authenOrgMap = {};

	//项目公司图标
	var projIcon = new BMap.Icon('img/tk_zuobiao_huanwei.png', new BMap.Size(19, 25));
	//获取用户可见的项目公司列表
	var loadProjects = function(){
		var url = '/security/api/organization/getMonitorOrg';
		console.log(new Date());
		requestService.post(url,{}).then(function(data){//成功
			
			console.log(new Date());
			projCompanyMarkerMap = {};
			projCompanyPositionList = [];
			var markers = [];
			console.log(new Date())
			for(var item in data.data){
				/*var projCompany = data.data[item];
				var html = createProjHtml(projCompany.name);
				var point = new BMap.Point(projCompany.longitude, projCompany.latitude);
				var projCompanyMarker = new BMapLib.RichMarker(html,  point,{"enableDragging" : false});
				map.addOverlay(projCompanyMarker);
				
				//bind orgid
				projCompanyMarker.orgId = projCompany.orgId;
				
				projCompanyMarker.addEventListener('click', projCompanyMarkerClick);
				
				projCompanyMarkerList.push(projCompanyMarker);
				projCompanyPositionList.push(point);*/
				
				var projCompany = data.data[item];
				
				var point = new BMap.Point(projCompany.longitude, projCompany.latitude);
				var projCompanyMarker = new BMap.Marker(point,{icon:projIcon,offset:new BMap.Size(-2,-15)});
				//map.addOverlay(projCompanyMarker);
				markers.push(projCompanyMarker);
				
				if($scope.hasVedioAccess) {
					projCompanyMarker.addEventListener('click',projCompanyMarkerClick);
				}
				
				//bind orgid
				projCompanyMarker.orgId = projCompany.orgId;
				projCompanyMarker.orgName = projCompany.name;
				projCompanyMarker.project = projCompany;
				var label = new BMap.Label(projCompany.name,{offset:new BMap.Size(20,0)});
				label.setStyle(cacheService.getProjLabelStyle());  
				projCompanyMarker.setLabel(label);
				label.orgId = projCompany.orgId;
				
				label.addEventListener('click',projCompanyLabelClick);
				
				
				projCompanyMarkerMap[projCompany.orgId]=projCompanyMarker;
				projCompanyPositionList.push(point);
				
				//map.addOverlay(projCompanyMarker);
				showProjOnMap();
				
			}
			//var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers, maxZoom:10, minClusterSize:5});
			//调整视野
			/*map.setViewport(projCompanyPositionList);
			var z = map.getZoom();
			if(z>=zoom){
				map.setZoom(zoom);
			}*/
			chinaView();
			console.log(new Date())
		},function(error){//失败
			notifications.showError('获取项目公司失败！');
		});
	}
	loadProjects();
	var chinaView = function(){
		var chinaBounds = [{lng:122.842173,lat:53.412275},
		       			{lng:73.684596,lat:39.313958},
		       			{lng:134.690032,lat:48.393105},
		       			{lng:109.485735,lat:18.347819}];
		var pList = [];
		for(var p in chinaBounds){
			pList.push(new BMap.Point(chinaBounds[p].lng, chinaBounds[p].lat));
		}
		map.setViewport(pList);
		map.setCenter(new BMap.Point(96.599135,36.790307))
	}
	
	var getPortalInfo = function(url, param){
		var deferred = $q.defer();
		requestService.post(url, param).then(
			function(data) {
				deferred.resolve(data);
			}
		);
		return deferred.promise;
	};
	//根据下拉框选择在地图上显示其相应公司
	var showProjOnMap = function(){
		if($scope.portalInfos == null || $scope.portalInfos.orgId == null) return;
		var par = $scope.portalInfos.orgId;
		var target = authenOrgMap[par];
		
		if(target == null) return;
		
		var lenOwnerCode = target.ownerCode.length;
		var markers = [];
		angular.forEach(projCompanyMarkerMap,function(pro,index){
			if(pro.project.ownerCode.substring(0, lenOwnerCode) == target.ownerCode){
				pro.show();
				markers.push(pro);
			}
			else{
				pro.hide();
			}
		});
		var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers, maxZoom:10, minClusterSize:5});
	};
	
	 $scope.orgItemList =[];
	 $scope.ngOrgOptions={title:'请选择顶级机构公司'};
	(function(){
		var url = '/security/api/portalInfo/portalInfos';
    	var param = {
    		
    	};
    	getPortalInfo(url, param).then(
    		function(result) {
    			//$scope.portalInfos = result.data;
    			$scope.portalInfos = result.data.portalInfo;
    			//$scope.liArr =[];
    			var authenOrgList = result.data.org;
    			for(var i=0;i<authenOrgList.length;i++){
    				authenOrgMap[authenOrgList[i].orgId] = authenOrgList[i];
    				//$scope.liArr[i]={key:authenOrgList[i].name,value:authenOrgList[i].orgId,oth:true};
    				$scope.orgItemList[i]={id:authenOrgList[i].orgId,name:authenOrgList[i].name};
    				if(result.data.portalInfo.orgId==authenOrgList[i].orgId){
    					$scope.ngOrgOptions.title = authenOrgList[i].name;
    				}
    			}
    			showProjOnMap();
    			// 环卫人员取90%
    			/*if ($scope.portalInfos && $scope.portalInfos.employee) {
    				$scope.portalInfos.employee = Math.round($scope.portalInfos.employee * 9 / 10);
    			}
    			notifications.showWarning(result.message);*/
    		},
    		function(error) {
    			
    		}
    	);
    	
    	//判断是否有综合监控权限
		url = "/security/checkUrl";
		var params = {url:'home.sideMenu.comprehensive'};
		requestService.post(url,params,true).then(function(data){				
			$scope.hasVedioAccess = data.data == true?true:false;
		});
	}());
	//下拉框改变
//	$scope.statusChanged =function(){
//		var url="/security/api/portalInfo/portalInfo";
//		var par=$scope.liVal;
//		if(par){
//		var params ={orgId: par};
//		requestService.post(url,params).then(function(result){
//			$scope.portalInfos =result.data;
//			showProjOnMap();
//		});
//		}
//	};
	$scope.ngOrgOptions.itemClickCallback = function(id){		
		var url="/security/api/portalInfo/portalInfo";
		var orgItemList=$scope.orgItemList;
		if(id){
		var params ={orgId:id};
		requestService.post(url,params).then(function(result){
			$scope.portalInfos =result.data;
			for(var i=0;i<orgItemList.length;i++){
				if(orgItemList[i].id==result.data.orgId){
					$scope.ngOrgOptions.title =orgItemList[i].name;
					break;
				}
			}
			showProjOnMap();
		});
		}		
	}
	
	
	//获取公司信息
	$(function(){
		var getPage = function(curPage, pageSize, sort) {
			var url = '/security/api/tenant/getTenantById';
			var param={};
			requestService.post(url, param).then(function(data) {
				var desc=data.data.description;
				
				var v=desc.replace(/<[^>]+>/g,"");
				$scope.com = data.data;
				$scope.com.description=v;
				
			});
		};
		
		getPage();
	});
	
	
	//点击项目公司
    var projCompanyMarkerClick = function(e){
    	
    	/*if(!confirm("确定进入[ " + e.target.orgName + " ]综合监察界面吗？")){
			return;
		}
    	
    	//$cookieStore.put('monitorOrgId',e.target.orgId);
    	mapMonitorService.setSelectedOrg({'orgId':e.target.orgId,'position':e.target.getPosition(),'orgName':e.target.orgName,'zoom':14});
    	
    	$state.go('home.sideMenu.comprehensive',{moduleId:"32",moduleName:"envsanitation"});*/
    	
    	$scope.deleteType=true;
		ngDialog.openCustomConfirm({			
			width:'32%',
			scope:$scope,
			title:'确认',
			message:"确定进入[ " + e.target.orgName + " ]综合监察界面吗？"
		}).then(function(success){
			$cookieStore.put('monitorOrgId',e.target.orgId);
	    	mapMonitorService.setSelectedOrg({'orgId':e.target.orgId,'position':e.target.getPosition(),'orgName':e.target.orgName,'zoom':14});
	    	
	    	$state.go('home.sideMenu.comprehensive',{moduleId:"32",moduleName:"envsanitation"});
		}, function(error){
			console.log(error);
			return;
		});
    }
    
    var projCompanyLabelClick = function(e){
    	
    	//获取项目公司的环卫设施
    	var projMarker = projCompanyMarkerMap[e.target.orgId];
    	if(projMarker == null) return;
		
		var url = '/security/api/portalInfo/portalInfo';
    	var param = {
    		orgId: projMarker.orgId
    	};
    	getPortalInfo(url, param).then(function(result){
			e.portalInfo = result.data;
			openInfo(e);
		});
    	
    }
    
    
	//初始化弹框
	var infoBox = new BMapLib.InfoBox(map,"",{
		boxClass:'panel'
		,offset: {width:0,height:0}
		,closeIconMargin: "1px 1px 0 0"
		,enableAutoPan: true
		,align: INFOBOX_AT_TOP
		,closeIconUrl:"img/guanbi_moren.png"
	});	
	
	//显示弹框
	var pStyle = 'width: 80%;height: 15px;line-height: 15px;font-weight: 300;float: left; font-size: 14px; margin: 4px 0; overflow: hidden;  white-space: nowrap; text-overflow: ellipsis;';
	var iStyle = 'width: 90px; font-style: inherit; text-align: left; float: left;';
	
    var openInfo = function(e){
		
    	if(e.portalInfo == null) return;
    	
		infoBox.open(e.target.getPosition());
		var html = '<div class="panel panel-primary" style="margin-bottom: 0px;width: 300px;">\
					<div class="panel-heading">基本信息</div>\
					<div class="panel-body">\
					<ul><li><p style="'+pStyle+'"><i style="'+iStyle+'">服务人口</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.population?e.portalInfo.population:0)+'万人</span></p></li>\
					<li><p style="'+pStyle+'"><i style="'+iStyle+'">再生资源回收</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.recycle?e.portalInfo.recycle:0)+'吨/月</span></p></li>\
					<li><p style="'+pStyle+'"><i style="'+iStyle+'">清扫保洁面积</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.sweepArea?e.portalInfo.sweepArea:0)+'万平方米</span></p></li>\
					<li><p style="'+pStyle+'"><i style="'+iStyle+'">环卫车辆</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.car?e.portalInfo.car:0)+'辆</span></p></li>\
					<li><p style="'+pStyle+'"><i style="'+iStyle+'">垃圾箱</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.dustbin?e.portalInfo.dustbin:0)+'个</span></p></li>\
					<li><p style="'+pStyle+'"><i style="'+iStyle+'">中转站</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.station?e.portalInfo.station:0)+'座</span></p></li>\
					<li><p style="'+pStyle+'"><i style="'+iStyle+'">公厕</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.wc?e.portalInfo.wc:0)+'个</span></p></li>\
					<li><p style="'+pStyle+'"><i style="'+iStyle+'">垃圾清运</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.garbageCleanup?e.portalInfo.garbageCleanup:0)+'吨/天</span></p></li>\
					<ul>\
					</div></div>';		
		infoBox.setContent(html);
		//loadEmpsPlan(item.employeeId);
	}
// <li><p style="'+pStyle+'"><i style="'+iStyle+'">广告屏</i><em style="font-style: inherit;">: </em><span>'+(e.portalInfo.advertScreen?e.portalInfo.advertScreen:0)+'块</span></p></li>\
	//1秒钟后载入项目公司到地图
    //$timeout(function(){loadProjects();},1000);
	
	//项目公司间切换
	//功能视图切换
	$scope.itemList = [{id:1,name:'进入平台'},{id:2,name:'决策统计'}];
	$scope.ngOptions={title:'显示地图'};
	//点击左上角项目公司名称，定位到项目公司监测点; 点击返回项目公司视图，回到全国地图视图
	$scope.ngOptions.itemClickCallback = function(id){		
		if(id == 1){//进入平台
			if($scope.hasVedioAccess) {
				$location.path('/home/envsanitation/32/comprehensive');
			}
			else{
				$location.path('/home/home/30/info');
			}
		}			
		else if(id == 2){//进入决策统计
			$location.path('/home/home/30/statistical');
		}
	}
	
	
}]);                                       		
                                     		
                                      		
                                      		
                                      		
