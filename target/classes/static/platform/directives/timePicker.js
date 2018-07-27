angular.module('timePickers',[]).directive('timeUi',function(){
	return{
		restrict:'EAMC',
	    templateUrl:'platform/template/timePicker.html',
	    replace:true,
	    scope:{
	    	mytime:'='
	    },
	    controller:function($scope){
	    	$scope.mytime = new Date();

            //默认小时和分钟每次添加1位数
            $scope.hstep = 1;
            $scope.mstep = 1;

            $scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
            };

            //如果是true,表示是12小时制度
            $scope.ismeridian = false;
            $scope.toggleMode = function() {
                $scope.ismeridian = ! $scope.ismeridian;
            };


           /* $scope.update = function() {
                console.log("进来了");
                var d = new Date();
                d.setHours( 14 );
                d.setMinutes( 0 );
                $scope.mytime = d;
            };*/

            $scope.changed = function () {
                console.log('Time changed to: ' + $scope.mytime);
            };

            $scope.clear = function() {
                $scope.mytime = null;
            };
	    },
	    link:function(scope,element,attrs){
	    	console.log(attrs.labelname);
	    	scope.labelName=attrs.labelname;
	    }
	}
}).directive('timeFormat', ['$filter',function($filter) {  
    var dateFilter = $filter('date');  
    return {  
        require: 'ngModel',  
        link: function(scope, elm, attrs, ctrl) {  
            ctrl.$parsers.push(function (viewValue) {
            	console.log(viewValue)
                return dateFilter(viewValue, 'HH:mm');
            });
            //$formatters：从modelValue到viewValue的过程
            ctrl.$formatters.push(function(modelValue){
            	console.log(modelValue)
                if(modelValue!==undefined){
                    return dateFilter(modelValue, 'HH:mm');
                } 
            });
        }  
    };  
}]);