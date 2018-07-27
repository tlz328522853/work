angular.module('findSelectTemp').directive('findSelect', function (requestService) {
	return{
        restrict:'EAMC',
        templateUrl:'platform/template/findSelect.html',
        replace:true,
        scope:{
        	onSelect: '&',
        	onSelectGroup: '&'
        },
        link:function(scope,element,attrs){
        	var _scope = scope;
        	_scope.findValue="";
        	_scope.selectValue="";
        	_scope.isOpenP=false;
        	_scope.provinces=[];
        	_scope.selectOption = function(){
        		_scope.provinces=_scope.onSelect({'param':_scope.findValue});
        		if(_scope.provinces!=null&&_scope.provinces.length>0){
        			_scope.isOpenP=true;
        		}else{
        			_scope.isOpenP=false;
        		}
    		}
//        	_scope.selectEnd = function(){
//        		_scope.isOpenP=false;
//        		_scope.findValue=_scope.selectValue
//    		}
        	_scope.selectFindGroup=function(p){
        		_scope.findValue=_scope.selectValue = p.name;
        		_scope.onSelectGroup({'id':p.id});
        		_scope.isOpenP=false;
        	}
        }
    }
});