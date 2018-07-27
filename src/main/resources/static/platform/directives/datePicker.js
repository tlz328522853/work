angular.module('datePickers',[]).directive('dateUi',function(){
	return{
		restrict:'EAMC',
	    templateUrl:'platform/template/datePicker.html',
	    replace:true,
	    scope:{
	    	dt:'=',
	    	ngChanged:'&',
            dateReadonly:'=',
            dateDisabled:'=',
	    	dateRequired:'=',
	    	dateFormat:'=',
	    	initDate:'=',
	    	maxFlag:'=',
	    },
	    controller:function($scope){
	    	$scope.today = function () {
	    		//一般修改的话，dt会从controller层传递过来，所以需要判断
	    		if($scope.dt===null || $scope.dt===undefined || $scope.dt.length<=0){
	    			
	    			if ($scope.initDate && $scope.dateFormat != null && $scope.dateFormat == 4) {
	    				$scope.dt = new Date();
	    			}
	    			
	    		}else{
	    			if("number" === typeof date)
	    			{
	    				$scope.dt = new Date().setTime($scope.dt);
	    			}
	    		}
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };
            
            //日期可选范围
            $scope.dateOptions = {
                /*dateDisabled: disabled,*/
                formatYear: 'yy',
               // maxDate: new Date(3000, 12, 31),
               // maxDate: $scope.maxFlag?new Date(new Date().getTime() - 24*60*60*1000):new Date(3000, 12, 31),
                maxDate: $scope.maxFlag?new Date(new Date().getTime()):new Date(3000, 12, 31),
                minDate: new Date(1940, 1, 1),
                startingDay: 1
            };
//            $scope.$watch('selMaxDate', function(v){
//	             $scope.dateOptions.maxDate = new Date();
//	         });
            //可以禁止选择某个日期
            /*function disabled(data) {
                var date = data.date,
                        mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }*/

            $scope.toggleMin = function () {
            	//$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            	//跟其他控件冲突
                $scope.inlineOptions.minDate = new Date(1940, 1, 01);
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.toggleMin();

            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };

            $scope.setDate = function (year, month, day) {
//            	console.log(year+"-"+month+"-"+day)
                $scope.dt = new Date(year, month, day);
            	if($scope.ngChanged){
            		$scope.ngChanged();
            	}
            };

            $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd HH:mm:ss'];
            $scope.placeholders = ['例2008-08-01', '例2008/08/01', '例01.08.2008', '例shortDate', '例2008-08-01 20:08:00'];
            // dateFormat存在时，选用对应的日期时间格式，不存在默认'yyyy-MM-dd'
            var index = $scope.dateFormat != null ? $scope.dateFormat : 0;
            $scope.format = $scope.formats[index];
            $scope.placeholder = $scope.placeholders[index];
            $scope.altInputFormats = ['yyyy-M!-d!'];
            $scope.popup1 = {
                opened: false
            };

            $scope.popup2 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            function getDayClass(data) {
                var date = data.date,mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }
                return '';
            }
	    },
	    link:function(scope,element,attrs){
//	    	console.log(attrs.labelname);
	    	scope.labelName=attrs.labelname;
	    	scope.unToday=attrs.untoday;
	    }
	}
});