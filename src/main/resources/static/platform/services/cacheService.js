app.service('cacheService',['requestService','notifications','$q','$timeout','$state',
function(requestService,notifications,$q,$timeout,$state) {

	var orgsList = null;// [{value:1,name:部门1},{value:2, name:部门2}]
	var orgsTree = null;// [{id:1,label:部门1,
						// children:[{id:1,label:部门2}]}]

	var filterDicSet = {};
	var directiveDicSet = {};
	
	var treeData = [];
	var items = {};
	var orgData={};
	/*
	var mapStyle = {styleJson:[{"featureType": "road","elementType": "all","stylers": {"lightness": 20}},{ "featureType": "highway","elementType": "geometry","stylers": {"color": "#d9ead3"
	}},{"featureType": "railway","elementType": "all", "stylers": {"visibility": "off"}},{"featureType": "local","elementType": "labels","stylers": {"visibility": "off"
	}},{"featureType": "water","elementType": "all","stylers": {"color": "#d1e5ff"}},{"featureType": "poi","elementType": "all","stylers": {"visibility": "off"}}]};
	*/
	var mapStyle = {styleJson:[]};
	var projLabelStyle = { border: "0px solid rgb(255, 0, 0)",'border-radius': "5px",background:"#005cab",color:"white",whiteSpace: "nowrap",padding: "2px 1px 1px",cursor: "pointer",font: "15px arial,sans-serif"};
	var onlineLabelStyle = { border: "1px solid #fff",'border-radius': "5px",background:"green",color:"white",whiteSpace: "nowrap",padding: "2px 1px 1px",cursor: "pointer",font: "15px arial,sans-serif"};
	var onlineLabelStyle2 = { border: "1px solid #fff",'border-radius': "5px",background:"#DD0",color:"white",whiteSpace: "nowrap",padding: "2px 1px 1px",cursor: "pointer",font: "15px arial,sans-serif"};
	var offlineLabelStyle = { border: "1px solid #fff",'border-radius': "5px",background:"gray",color:"white",whiteSpace: "nowrap",padding: "2px 1px 1px",cursor: "pointer",font: "15px arial,sans-serif"};
	
	var humanOfflineCode = {'0':'成功','1':'基础定位平台异常','2':'基础定位平台繁忙或超出定位请求上限','3':'核心网忙而无法处理请求','4':'SPID鉴权失败（SPID不存在或IP地址不存在或状态错误）','5':'SPID密码错误','6':'请求包中号码超过限制','7':'请求包格式有问题','8':'请求包的语法不对','9':'定位时超出定位请求上限','10':'取消周期定位消息时reqid不存在','11':'未知的MSID','12':'回叫号码未知','13':'无效的请求信息','14':'返回的是手机的信道信息','15':'未检测到信号','16':'PDE超时','17':'位置未确定','18':'返回的是TDMA MAHO信息','19':'TDMA MAHO信息不可得达','20':'接入拒绝','21':'所请求的PQOS无法达到','22':'CDMA中基于移动台的定位所需的资源目前不可得','23':'CDMA中基于移动台的定位操作失败','24':'CDMA中基于移动台的定位操作不能被PDE触发','25':'CDMA中基于移动台的定位操作未完成','100':'LCS Client 未知','101':'发起定位的用户未知','102':'号码未开通定位权限或停机或定位鉴权绑定异常','103':'LCS Client未授权或者密码不符','104':'用户欠费或停机','105':'基础定位平台定位超时','106':'请求应用不在MS的私人例外表中','107':'对用户定位时移动网络忙','108':'用户主动定位时收到平台定位请求','109':'终端不支持被请求的定位方法，V1终端不支持周期定位','110':'无法获得在服务质量中说明的被请求时间要求','111':'基础定位平台返回未知错误','112':'用户余额不足','113':'用户欠费','114':'移动台挂失','115':'CP在用户列表中完全拒绝','116':'CP该时间段不允许','117':'主叫用户密码错','118':'主叫用户该时间段不允许','119':'CP欠费','120':'CP无第三方能力','121':'系统错误 (系统内部出错)','122':'被查手机在ICP的配置中禁止 被查手机在行业ICP的黑名单','123':'基础定位平台定位超时','124':'用户确认为拒绝查询（查询需要用户确认时，用户返回拒绝）','125':'用户不在服务区内(手机无信号)','126':'不支持的服务','127':'禁止定位','128':'基站数据缺失','129':'请求定位平台错误','130':'用户关机','131':'终端不支持或不能上网或没有使用CTWAP拨号或未开启定位功能','132':'定位时用户正在通话','136':'等待定位结果超时','137':'周期定位中：时间间隔低于系统限制、持续时间大于系统设置最大时间','138':'未知错误','139':'请求包中版本信息不是1.00，即<REQ Ver="1.00">','140':'定位请求鉴权失败','146':'不支持请求中的精度，如：请求精度小于50米','147':'被定位号码白名单鉴权失败','148':'出于法律原因，该定位不允许','149':'基站数据库缺失','155':'错误的GSM网路参数，不合法或者不支持的net_param参数','156':'不支持的地理坐标系','157':'不支持查询所要求的定位精度','158':'不支持查询所要求的响应时间','160':'取消周期定位时REQID不存在','161':'SP不具有发送相应定位请求类型的权限','162':'需要漫游，而目的城市未开通此服务','166':'元素属性值不支持','167':'因终端设备启动隐私限制，终端拒绝','168':'用户同意，但无法上网','169':'用户拒绝','170':'等待用户确认超时','171':'被定位终端发起MO取消消息','178':'UIM卡IMSI与基础定位平台不匹配或用户关机','180':'用户主动定位时收到平台定位请求','200':'基础定位平台资源不足','201':'手机发送数据链路失败','202':'基础定位平台异常','204':'上传定位数据异常','210':'基础定位平台定位超时','220':'基础定位平台定位超时','221':'基础定位平台定位超时','224':'基础定位平台定位超时','226':'用户关机','232':'基础定位平台定位超时','233':'基础定位平台定位超时','238':'基础定位平台定位超时','245':'号码状态异常或停机或用户关机','5001':'定位超时','5002':'经纬度纠偏出错','5003':'地址解析出错','5004':'基础定位平台连接异常','5005':'解析定位响应出错','5007':'超出流量限制'};
	
	var getOrgsTreeFun = function() {
		return orgsTree;
	}
	var removeItemsFun=function() {
		items={};
		directiveDicSet = {};
	}
	
	var removeOrgsFun =function(){
		orgData={};
	}
	var getOrgListFun = function() {
		return orgsList;
	}

	var setOrgsTreeFun = function(orgsT) {
		orgsTree = orgsT;
	}

	var setOrgsListFun = function(orgsL) {
		orgsList = orgsL;
	}
	var dicNameMap = {
					'发票类型' : '1405592801686249',
					'广告载体' : '4663600092367423',
					'广告形式' : '4002971430598973',
					'所属设备类型' : '372685869724616',
					'合同类型' : '6577781076375885'
				};
	var urlGetDicFun = '/security/api/dic/getDicList';
	var getDicFun = function(dicType, isFilter, hasChild) {
		var dicId=dicNameMap[dicType];//兼容传入id或名称
		if(dicId==null){
			dicId=dicType;
		}
		if (!directiveDicSet[dicId]) {
			param = {pid : dicId}
			if(hasChild) {
				param.includeChild = 1
			}
			requestService.post(urlGetDicFun, param, true).then(function(data) {
				var map = {};
				data.data.forEach(function(item){
						
						if(hasChild) {
							if(!directiveDicSet[item.pid]) {
								directiveDicSet[item.pid] = [];
								filterDicSet[item.pid] = {};
							}
							directiveDicSet[item.pid].push(item);
							filterDicSet[item.pid][item.dicId] = item.name;
						}else{
							map[item.dicId] = item.name;
						}
				})
				if(!hasChild) {
					directiveDicSet[dicId] = data.data;
					filterDicSet[dicId] = map;
				}
			});

		}
		
		return isFilter?filterDicSet[dicId]:directiveDicSet[dicId];
	}
	
	var getTreeData = function() {
		var deferred = $q.defer();
		if(treeData.length == 0){
			var url = '/security/api/function/treedata';
			var param = {};
			requestService.post(url, param, true).then(
				function(data) {
					treeData = data.data;
					deferred.resolve(treeData);
				},
				function(error) {
					deferred.reject(error);
				}
			);
		}else{
			deferred.resolve(treeData);
		}
		return deferred.promise;
	};
	
	var getSideMenu = function(url, param, isLoading) {
		var deferred = $q.defer();
		if(!items[param.id]){
			requestService.post(url, param, isLoading).then(
				function(data) {
					items[param.id] = data.data;
					$timeout(function(){
						for(var item in data.data){
							if(data.data[item.url] != null){
								$state.go(data.data[item.url]);
								break;
							}	
						}
					}, 1000);
					deferred.resolve(items);
				},
				function(error) {
					deferred.reject(error);
				}
			);
		}else{
			deferred.resolve(items);
		}
		return deferred.promise;
	};

	var getOrgsTree=function (param){
		var deferred = $q.defer();
		var url = '/security/api/organization/getOrgTree';
		if (!param) {
			param = {};
			if(!orgData.orgs){
				requestService.post(url,param, true).then(
				        function (data) {
				        	orgData.orgs=data.data;
				        	deferred.resolve(orgData.orgs);
						}, function(error) {
							deferred.reject(error);
						}
				        );
					}else{
						deferred.resolve(orgData.orgs);
					}
		}else{
			if(!orgData.depart){
				requestService.post(url,param, true).then(
				        function (data) {
				        	orgData.depart=data.data;
				        	deferred.resolve(orgData.depart);
						}, function(error) {
							deferred.reject(error);
						}
				        );
					}else{
						deferred.resolve(orgData.depart);
					}
		}
		return deferred.promise;
	}
	
	return {
		getOrgs : getOrgsTreeFun,
		getOrgList : getOrgListFun,
		setOrgsTree : setOrgsTreeFun,
		getOrgsTree : getOrgsTree,
		setOrgsList : setOrgsListFun,
		getDic : getDicFun,
		getTreeData: getTreeData,
		getSideMenu: getSideMenu,
		removeItems: removeItemsFun,
		removeOrgs : removeOrgsFun,
		getMapStyle: function(){return mapStyle;},
		getProjLabelStyle:function(){return projLabelStyle;},
		getMonitorLabelStyle:function(status){if(1==status) return onlineLabelStyle; else if(2==status) return onlineLabelStyle2; else return offlineLabelStyle;},
		getHumanOfflineMsg:function(code){return humanOfflineCode[code];}
	};

}]);