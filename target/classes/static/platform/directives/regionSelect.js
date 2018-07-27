angular.module('regionSelectTemp', []).directive('regionSelect', function (larRequestService) {
	return{
        restrict:'EAMC',
        templateUrl:'platform/template/region.html',
        replace:true,
        scope:{
        	address:'=',
        	provinceId:'=provinceId',
        	cityId:'=cityId',
        	areaId:'=areaId',
        	provinceName:'=provinceName',
        	cityName:'=cityName',
        	areaName:'=areaName',
        	province:'=',
        	city:'=',
        	area:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.province===null || _scope.province==='' || _scope.province===undefined || _scope.address===null || _scope.address==='' || _scope.address===undefined){
        		_scope.province="请选择省份";
        	}
        	if(_scope.city===null || _scope.city==='' || _scope.city===undefined || _scope.address===null || _scope.address==='' || _scope.address===undefined){
        		_scope.city="请选择城市";
        	}
        	if(_scope.area===null || _scope.area==='' || _scope.area===undefined || _scope.address===null || _scope.address==='' || _scope.address===undefined){
        		_scope.area="请选择区县";
        	}
        	_scope.isOpenP=false;
        	_scope.isOpenC=false;
        	_scope.isOpenA=false;
        	_scope.provinces=[];
        	_scope.citys=[];
        	_scope.areas=[];
        	_scope.choiceP = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
        	_scope.choiceC = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
        	_scope.choiceA = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
        	_scope.selectPro = function(){
        		_scope.isOpenP=!_scope.isOpenP;
        		if(_scope.isOpenP){
        			_scope.isOpenC=false;
        			_scope.isOpenA=false;
        		}
        		if(_scope.isOpenP){
        			if(_scope.provinces===[] || _scope.provinces.length<=0){
        				//http://localhost:8080/larsecurity/api/larRegion/getRegions/1
        				//请求省份
    	            	var url = '/lar/api/larRegion/getRegions/1';
    	            	console.log(url);
        	            var param = {}
        	            larRequestService.get(url, param).then(function(data) {
        	            	_scope.provinces = data.data.data
    	                },function(error) {
    	                    console.log("erro:"+ error.message);
    	                });
        			}
        		}
    		}

        	_scope.selectCity = function(){
        		_scope.isOpenC=!_scope.isOpenC;
        		if(_scope.isOpenC){
        			_scope.isOpenP=false;
        			_scope.isOpenA=false;
        		}
        		if(_scope.provinces!=[] && _scope.provinces.length>0){
        			if(_scope.choiceP.regionId!=""){
        				var url = '/lar/api/larRegion/getRegions/'+_scope.choiceP.regionId;
        	            var param = {}
        	            larRequestService.get(url, param).then(function(data) {
        	            	_scope.citys = data.data.data
    	                },function(error) {
    	                    console.log("erro:"+ error.message);
    	                });
        			}
        		}
    		}
        	_scope.selectArea = function(){
        		_scope.isOpenA=!_scope.isOpenA;
        		if(_scope.isOpenA){
        			_scope.isOpenC=false;
        			_scope.isOpenP=false;
        		}
        		if(_scope.provinces!=[] && _scope.provinces.length>0 && _scope.citys!=[] && _scope.citys.length>0){
        			if(_scope.choiceP.regionId!="" && _scope.choiceC.regionId!=""){
        				var url = '/lar/api/larRegion/getRegions/'+_scope.choiceC.regionId;
        	            var param = {}
        	            larRequestService.get(url, param).then(function(data) {
        	            	_scope.areas = data.data.data
    	                },function(error) {
    	                    console.log("erro:"+ error.message);
    	                });
        			}
        		}
    		}

        	_scope.selectP=function(p){
        		_scope.choiceP = p;
        		_scope.province=_scope.choiceP.regionName;
        		_scope.provinceId = _scope.choiceP.regionId;
        		_scope.provinceName = _scope.choiceP.regionName;
        		if(_scope.choiceP.regionName!="" && _scope.choiceC.regionName!=""){
        			_scope.choiceC = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
                	_scope.choiceA = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
                	_scope.city="请选择城市";
                	_scope.area="请选择区县";
        		}
        		_scope.address = _scope.choiceP.regionName+_scope.choiceC.regionName+_scope.choiceA.regionName;
        		_scope.areas=[];
        	}
        	_scope.selectC=function(c){
        		_scope.choiceC = c;
        		_scope.city=_scope.choiceC.regionName;
        		_scope.cityId = _scope.choiceC.regionId;
        		_scope.cityName = _scope.choiceC.regionName;
        		if(_scope.choiceP.regionName!="" && _scope.choiceC.regionName!="" && _scope.choiceA.regionName!=""){
                	_scope.choiceA = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
                	_scope.area="请选择区县";
        		}
        		_scope.address = _scope.choiceP.regionName+_scope.choiceC.regionName+_scope.choiceA.regionName;
        	}
        	_scope.selectA=function(a){
        		_scope.choiceA = a
        		_scope.area=_scope.choiceA.regionName;
        		_scope.areaId = _scope.choiceA.regionId;
        		_scope.areaName = _scope.choiceA.regionName;
        		_scope.address = _scope.choiceP.regionName+_scope.choiceC.regionName+_scope.choiceA.regionName;
        	}
        }
    }
}).directive('dropList', function (larRequestService) {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' " +
        		"ng-click='selectPro()' ng-class=\"{'open':isOpen}\"><span ng-bind='area.areaName'>" +
        		"</span><ul style='width: 100%;position: absolute;margin-top: 20px;'>" +
        		"<li style='width: 100%' ng-repeat='a in areas' ng-bind='a.areaName' " +
        		"ng-click='select(a)'></li></ul></div></div>",
        replace:true,
        scope:{
        	area:'=',
        	areas:'=',
        	salesmans:'=',
        	salesman:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.area === null || _scope.area===undefined || _scope.area.areaName===null || _scope.area.areaName==='' || _scope.area.areaName===undefined){
        		_scope.area.areaName="请选择片区";
        	}
        	_scope.isOpen=false;
        	_scope.selectPro = function(){
        		_scope.isOpen=!_scope.isOpen;
    		}

        	_scope.select=function(a){
        		_scope.area = a;
        		//根据片区ID查询业务员
    			var url = '/lar/api/orderManager/getSalesmansByAreaId/'+_scope.area.id;
    			//获取机构对应的片区列表
    			larRequestService.get(url, null).then(function(d) {
    				if(d.data.data===null){
    					_scope.salesman.manNam='请选择业务员';
    				}
    				//获取这个机构所有片区的集合
    				_scope.salesmans = d.data.data;
                },function(error) {});
        	}
        }
    }
}).directive('dropAreaList', function (larRequestService) {
	return{
        restrict:'EAMC',
        templateUrl:'platform/template/dropDownList.html',
        replace:true,
        scope:{
        	area:'=',
        	areas:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.area === null || _scope.area===undefined || _scope.area.areaName===null || _scope.area.areaName==='' || _scope.area.areaName===undefined){
        		_scope.area.areaName="请选择片区";
        	}
        	_scope.isOpen=false;
        	_scope.selectPro = function(){
        		_scope.isOpen=!_scope.isOpen;
    		}
        	_scope.select=function(a){
        		_scope.area = a;
        	}
        }
    }
}).directive('salesmanList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenManName}\"><span ng-bind='salesman.manName'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='s in salesmans' ng-bind='s.manName' ng-click='select(s)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	salesman:'=',
        	salesmans:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.salesman === null || _scope.salesman===undefined || _scope.salesman.manName===null || _scope.salesman.manName==='' || _scope.salesman.manName===undefined){
        		_scope.salesman.manName="请选择业务员";
        	}
        	_scope.isOpenManName=false;
        	_scope.selectPro = function(){
        		_scope.isOpenManName=!_scope.isOpenManName;
    		}

        	_scope.select=function(s){
        		_scope.salesman = s;
        	}
        }
    }
}).directive('recyTypeList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
        		 " ng-class=\"{'open':isOpenType}\"><span ng-bind='rType.typeName'></span><ul style='width: 100%'>" +
        		 "<li style='width: 100%' ng-repeat='t in rTypes' ng-bind='t.typeName' ng-click='select(t)'>" +
        		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	rType:'=',
        	rTypes:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.rType === null || _scope.rType===undefined || _scope.rType.typeName===null || _scope.rType.typeName==='' || _scope.rType.typeName===undefined){
        		_scope.rType.typeName="选择回收物类型";
        	}
        	_scope.isOpenType=false;
        	_scope.selectPro = function(){
        		_scope.isOpenType=!_scope.isOpenType;
    		}

        	_scope.select=function(t){
        		_scope.rType = t;
        	}
        }
    }
}).directive('recyNameList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenName}\"><span ng-bind='rName.goodsName'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='n in rNames' ng-bind='n.goodsName' ng-click='select(n)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	rName:'=',
        	rNames:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.rName === null || _scope.rName===undefined || _scope.rName.goodsName===null || _scope.rName.goodsName==='' || _scope.rName.goodsName===undefined){
        		_scope.rName.goodsName="选择回收物名称";
        	}
        	_scope.isOpenName=false;
        	_scope.selectPro = function(){
        		_scope.isOpenName=!_scope.isOpenName;
    		}

        	_scope.select=function(n){
        		_scope.rName = n;
        	}
        }
    }
}).directive('dropOsList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenOs}\"><span ng-bind='ownedSupplier.osName'></span><ul style='width: 100%;position: absolute;margin-top:20px;'>" +
		 "<li style='width: 100%' ng-repeat='o in ownedSuppliers' ng-bind='o.osName' ng-click='select(o)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	ownedSupplier:'=',
        	ownedSuppliers:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.ownedSupplier === null || _scope.ownedSupplier===undefined || _scope.ownedSupplier.osName===null || _scope.ownedSupplier.osName==='' || _scope.ownedSupplier.osName===undefined){
        		_scope.ownedSupplier.osName="选择供货商";
        	}
        	_scope.isOpenOs=false;
        	_scope.selectPro = function(){
        		_scope.isOpenOs=!_scope.isOpenOs;
    		}

        	_scope.select=function(o){
        		_scope.ownedSupplier = o;
        	}
        }
    }
}).directive('dropPersonnelList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='personnel.name'></span><ul style='width: 100%;position: absolute;margin-top: 20px;'>" +
		 "<li style='width: 100%' ng-repeat='p in personnels' ng-bind='p.name' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	personnel:'=',
        	personnels:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.personnel === null || _scope.personnel===undefined || _scope.personnel.name===null || _scope.personnel.name==='' || _scope.personnel.name===undefined){
        		_scope.personnel.name="选择工作人员";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.personnel = p;
        	}
        }
    }
}).directive('dropEvaluatelList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='evaluate.name'></span><ul style='width: 100%;margin-top:20px;'>" +
		 "<li style='width: 100%' ng-repeat='p in evaluates' ng-bind='p.name' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	evaluate:'=',
        	evaluates:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.evaluate === null || _scope.evaluate===undefined || _scope.evaluate.name===null || _scope.evaluate.name==='' || _scope.evaluate.name===undefined){
        		_scope.evaluate.name="选择评价等级";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.evaluate = p;
        	}
        }
    }
}).directive('cityList', function () {
	return{
		restrict:'EAMC',
		template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		" ng-class=\"{'open':isOpenPer}\"><span ng-bind='city.regionName'></span><ul style='width: 100%'>" +
		"<li style='width: 100%' ng-repeat='p in serverCity' ng-bind='p.regionName' ng-click='select(p)'>" +
		"</li></ul></div></div>",
		replace:true,
		scope:{
			city:'=',
			serverCity:'='
		},
		link:function(scope,element,attrs){
			var _scope = scope;
			//城市下拉框
			if(_scope.city === null || _scope.city===undefined || _scope.city.regionName===null || _scope.city.regionName==='' || _scope.city.regionName===undefined){
				_scope.city.regionName="选择服务城市";
			}
			_scope.isOpenPer=false;
			_scope.selectPro = function(){
				_scope.isOpenPer=!_scope.isOpenPer;
			}

			_scope.select=function(p){
				_scope.city = p;
			}
		}
	}
}).directive('completionTypeList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='completionType.name'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in completionTypes' ng-bind='p.name' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	completionType:'=',
        	completionTypes:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.completionType === null || _scope.completionType===undefined || _scope.completionType.name===null || _scope.completionType.name==='' || _scope.completionType.name===undefined){
        		_scope.completionType.name="选择完成类型";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.completionType = p;
        	}
        }
    }
}).directive('paymentList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='payment.name'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in payments' ng-bind='p.name' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	payment:'=',
        	payments:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.payment === null || _scope.payment===undefined || _scope.payment.name===null || _scope.payment.name==='' || _scope.payment.name===undefined){
        		_scope.payment.name="选择支付类型";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.payment = p;
        	}
        }
    }
}).directive('orderStatusList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='orderStatus.name'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in orderStatuss' ng-bind='p.name' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	orderStatus:'=',
        	orderStatuss:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.orderStatus === null || _scope.orderStatus===undefined || _scope.orderStatus.name===null || _scope.orderStatus.name==='' || _scope.orderStatus.name===undefined){
        		_scope.orderStatus.name="选择订单状态";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.orderStatus = p;
        	}
        }
    }
}).directive('failureTypeList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='failureType.name'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in failureTypes' ng-bind='p.name' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	failureType:'=',
        	failureTypes:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.failureType === null || _scope.failureType===undefined || _scope.failureType.name===null || _scope.failureType.name==='' || _scope.failureType.name===undefined){
        		_scope.failureType.name="选择时效类型";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.failureType = p;
        	}
        }
    }
}).directive('brandsList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='brand'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in brands' ng-bind='p' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	brand:'=',
        	brands:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.brand === null || _scope.brand===undefined || _scope.brand===''){
        		_scope.brand="请选择品牌";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.brand = p;
        	}
        }
    }
}).directive('goodsList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='shopName'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in shopNames' ng-bind='p' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	shopName:'=',
        	shopNames:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.shopName === null || _scope.shopName===undefined || _scope.shopName===''){
        		_scope.shopName="请选择商品";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.shopName = p;
        	}
        }
    }
}).directive('specificationList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='specification'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in specifications' ng-bind='p' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	specification:'=',
        	specifications:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.specification === null || _scope.specification===undefined || _scope.specification===''){
        		_scope.specification="请选择规格型号";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.specification = p;
        	}
        }
    }
}).directive('operatorList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='operator'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in operators' ng-bind='p' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	operator:'=',
        	operators:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.operator === null || _scope.operator===undefined || _scope.operator===''){
        		_scope.operator="请选择操作人";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.operator = p;
        	}
        }
    }
}).directive('cftPersonsList', function () {
	return{
        restrict:'EAMC',
        template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
		 " ng-class=\"{'open':isOpenPer}\"><span ng-bind='confirmationPerson.confirmPersionName'></span><ul style='width: 100%'>" +
		 "<li style='width: 100%' ng-repeat='p in confirmationPersons' ng-bind='p.confirmPersionName' ng-click='select(p)'>" +
		 "</li></ul></div></div>",
        replace:true,
        scope:{
        	confirmationPerson:'=',
        	confirmationPersons:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	if(_scope.confirmationPerson === null || _scope.confirmationPerson===undefined || _scope.confirmationPerson===''){
        		_scope.confirmationPerson.confirmPersionName="请选择确认人";
        	}
        	_scope.isOpenPer=false;
        	_scope.selectPro = function(){
        		_scope.isOpenPer=!_scope.isOpenPer;
    		}

        	_scope.select=function(p){
        		_scope.confirmationPerson = p;
        	}
        }
    }
})

	.directive('scannerList', function () {
		return{
			restrict:'EAMC',
			template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
			" ng-class=\"{'open':isOpenPer}\"><span ng-bind='scanner'></span><ul style='width: 100%'>" +
			"<li style='width: 100%' ng-repeat='s in scanners' ng-bind='s' ng-click='select(s)'>" +
			"</li></ul></div></div>",
			replace:true,
			scope:{
				scanner:'=',
				scanners:'='
			},
			link:function(scope,element,attrs){
				var _scope = scope;
				if(_scope.scanner === null || _scope.scanner===undefined || _scope.scanner===''){
					_scope.scanner="请选择扫描人";
				}
				_scope.isOpenPer=false;
				_scope.selectPro = function(){
					_scope.isOpenPer=!_scope.isOpenPer;
				}

				_scope.select=function(s){
					_scope.scanner = s;
				}
			}
		}
	})
	.directive('customerIdList', function () {
		return{
			restrict:'EAMC',
			template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
			" ng-class=\"{'open':isOpenPer}\"><span ng-bind='customerId'></span><ul style='width: 100%'>" +
			"<li style='width: 100%' ng-repeat='c in customerIds' ng-bind='c' ng-click='select(c)'>" +
			"</li></ul></div></div>",
			replace:true,
			scope:{
				customerId:'=',
				customerIds:'='
			},
			link:function(scope,element,attrs){
				var _scope = scope;
				if(_scope.customerId === null || _scope.customerId===undefined || _scope.customerId===''){
					_scope.customerId="请选择客户";
				}
				_scope.isOpenPer=false;
				_scope.selectPro = function(){
					_scope.isOpenPer=!_scope.isOpenPer;
				}
				_scope.select=function(c){
					_scope.customerId = c;
				}
			}
		}
	})
	.directive('dustList', function () {
		return{
			restrict:'EAMC',
			template:"<div class='input-group-btn'><div class='btn btn-primary select' ng-click='selectPro()'" +
			" ng-class=\"{'open':isOpenPer}\"><span ng-bind='dust'></span><ul style='width: 100%'>" +
			"<li style='width: 100%' ng-repeat='du in dusts' ng-bind='du' ng-click='select(du)'>" +
			"</li></ul></div></div>",
			replace:true,
			scope:{
				dust:'=',
				dusts:'='
			},
			link:function(scope,element,attrs){
				var _scope = scope;
				if(_scope.dust === null || _scope.dust===undefined || _scope.dust===''){
					_scope.dust="请选择仓库";
				}
				_scope.isOpenPer=false;
				_scope.selectPro = function(){
					_scope.isOpenPer=!_scope.isOpenPer;
				}
				_scope.select=function(du){
					_scope.dust = du;
				}
			}
		}
	})
;
