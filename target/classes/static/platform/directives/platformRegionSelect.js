angular.module('platformRegionSelectTemp', []).directive('platformRegionSelect', function (requestService) {
	return{
        restrict:'EAMC',
        templateUrl:'platform/template/platformRegion.html',
        replace:false,
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
        	area:'=',
        	code:'='
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	 //城市下拉框
        	if(_scope.provinceName===null || _scope.provinceName==='' || _scope.provinceName===undefined || _scope.address===null || _scope.address==='' || _scope.address===undefined){
        		
        		_scope.provinceName="请选择省份";
        	}
        	if(_scope.cityName===null || _scope.cityName==='' || _scope.cityName===undefined || _scope.address===null || _scope.address==='' || _scope.address===undefined){
        		
        		_scope.cityName="请选择城市";
        	}
        	if(_scope.areaName===null || _scope.areaName==='' || _scope.areaName===undefined || _scope.address===null || _scope.address==='' || _scope.address===undefined){
        		
        		_scope.areaName="请选择区县";
        	}
        	
        	_scope.isOpenP=false;
        	_scope.isOpenC=false;
        	_scope.isOpenA=false;
        	_scope.provinces=[];
        	_scope.citys=[];
        	_scope.areas=[];
        	_scope.choiceP = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:_scope.provinceName,regionNameEn:"",regionOrder:"",regionShortNameEn:""};
        	_scope.choiceC = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:_scope.cityName,regionNameEn:"",regionOrder:"",regionShortNameEn:""};
        	_scope.choiceA = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:_scope.areaName,regionNameEn:"",regionOrder:"",regionShortNameEn:""};
        	
        	_scope.selectPro = function(){
        		_scope.isOpenP=!_scope.isOpenP;
        		if(_scope.isOpenP){
        			_scope.isOpenC=false;
        			_scope.isOpenA=false;
        		}
        		
        		if(_scope.isOpenP){
        			if(_scope.provinces==null||_scope.provinces===[] || _scope.provinces.length<=0){
        				//http://localhost:8080/larsecurity/api/larRegion/getRegions/1
        				//请求省份
    	            	var url = '/security/api/region/getRegions';
    	            	console.log(url);
        	            var param = {}
        	            param.id=1;
        	            requestService.post(url, param).then(function(data) {
        	            	_scope.provinces = data.data;
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
        		
        		if((_scope.provinces!=[] && _scope.provinces.length>0)||_scope.province!=null){
        			 var param = {}
        			if(_scope.choiceP.regionId!=""){
        				 param.id=_scope.choiceP.regionId;
        			}else{
        				 param.id=_scope.province;
        			}
        			if(param.id!=null&&param.id!=""){
	        			var url = '/security/api/region/getRegions';
	    	            requestService.post(url, param).then(function(data) {
	    	            	_scope.citys = data.data;
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
        		if((_scope.provinces!=[] && _scope.provinces.length>0 && _scope.citys!=[] && _scope.citys.length>0)||_scope.city!=null){
        			 var param = {};
        			if(_scope.choiceP.regionId!="" && _scope.choiceC.regionId!=""){
        				 param.id=_scope.choiceC.regionId;
        			}else{
        				 param.id=_scope.city;
        			}
        			if(param.id!=null&&param.id!=""){
        				var url = '/security/api/region/getRegions';
        	           
        	            requestService.post(url, param).then(function(data) {
        	            	_scope.areas = data.data;
    	                },function(error) {
    	                    console.log("erro:"+ error.message);
    	                });
        			}
        		}
    		}
        	_scope.innit=function(){
        		var url = '/security/api/region/getRegions';
        		if(_scope.province!=null&&_scope.province!=''){
        			var param = {}
    	            param.id=1;
    	            requestService.post(url, param).then(function(data) {
    	            	_scope.provinces = data.data;
	                },function(error) {
	                    console.log("erro:"+ error.message);
	                });
            	}
        		if(_scope.city!=null&&_scope.city!=''){
        			var param = {}
    	            param.id=_scope.city;;
        			 requestService.post(url, param).then(function(data) {
	    	            	_scope.citys = data.data;
		                },function(error) {
		                    console.log("erro:"+ error.message);
		                });
            	}
        	}
        	_scope.innit();
        	_scope.selectP=function(p){
        		_scope.choiceP = p;
        		_scope.province=_scope.choiceP.regionId;//_scope.choiceP.regionName;
        		_scope.code=_scope.choiceP.regionCode;
        		_scope.provinceId = _scope.choiceP.regionId;
        		_scope.provinceName = _scope.choiceP.regionName;
        		if(_scope.choiceP.regionName!="" && _scope.choiceC.regionName!=""){
        			_scope.choiceC = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
                	_scope.choiceA = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
                	_scope.city="请选择城市";
                	_scope.cityName="请选择城市";
                	_scope.area="请选择区县";
                	_scope.areaName="请选择区县";
        		}
        		_scope.address = _scope.choiceP.regionName+_scope.choiceC.regionName+_scope.choiceA.regionName;
        		_scope.areas=[];
        	}
        	_scope.selectC=function(c){
        		_scope.choiceC = c;
        		_scope.city=_scope.choiceC.regionId;//_scope.choiceC.regionName;
        		_scope.code=_scope.choiceC.regionCode;
        		_scope.cityId = _scope.choiceC.regionId;
        		_scope.cityName = _scope.choiceC.regionName;
        		if(_scope.choiceP.regionName!="" && _scope.choiceC.regionName!="" && _scope.choiceA.regionName!=""){
                	_scope.choiceA = {parentId:"",regionCode:"",regionId:"",regionLevel:"",regionName:"",regionNameEn:"",regionOrder:"",regionShortNameEn:""};
                	_scope.area="请选择区县";
                	_scope.areaName="请选择城市";
        		}
        		_scope.address = _scope.choiceP.regionName+_scope.choiceC.regionName+_scope.choiceA.regionName;
        	}
        	_scope.closeOpen=function(){
        		_scope.citys=[];
        		_scope.provinces=[];
        		_scope.areas=[];
        		_scope.isOpenA=false;
        			_scope.isOpenC=false;
        			_scope.isOpenP=false;
        		
        	}
        	_scope.selectA=function(a){
        		_scope.choiceA = a
        		_scope.area=_scope.choiceA.regionId;//_scope.choiceA.regionName;
        		_scope.code=_scope.choiceA.regionCode;
        		_scope.areaName = _scope.choiceA.regionName;
        		_scope.address = _scope.choiceP.regionName+_scope.choiceC.regionName+_scope.choiceA.regionName;
        	}
        }
    }
});