/*angular.module('dropDownList', []).directive('dropList', function (larRequestService) {
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
})*/