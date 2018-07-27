/**
 * 地图打点
 */
app.service('planRouteService', [ 'ngDialog','$timeout','cacheService','$http','notifications', function(ngDialog,$timeout,cacheService,$http,notifications) {
	
	var defaultOpts = {	initPoints:null,
						center:new BMap.Point(116.404,39.915),//地图初始化中心
						width:'100%',//地图宽度
						saveCallback: null,//地图点击回调函数
						type: 1,//1,多边形，2,折线,
						readonly: false,
						zoom:16
						};
	
	var openMap = function(opts){
		
		//初始化参数
		opts = opts || defaultOpts;
		opts.center = opts.center || defaultOpts.center;
		opts.width = opts.width || defaultOpts.width;
		opts.type = opts.type || defaultOpts.type;
		opts.initPoints = opts.initPoints || defaultOpts.initPoints;
		opts.readonly = opts.readonly || defaultOpts.readonly;
		opts.zoom = opts.zoom || defaultOpts.zoom;
		
		//显示地图
		ngDialog.open({
		    template: '<div class="map_normal_route">'+
				'<div id="map_qb1"></div>'+
				'<div class="map_route">'+
				'<div ng-if="showEdit" class="route_div btn-group">'+				
				'<button ng-show="!isEdit" type="button" ng-click="goEdit()" class="btn btn-primary">编辑</button>'+
				'<button ng-show="isEdit" type="button" ng-click="goEdit()" class="btn btn-primary">完成</button>'+
				'<button ng-show="isEdit"  type="button" ng-click="delOnePoint()" class="btn btn-primary">单点撤销</button>'+
				'<button ng-show="isEdit"  type="button" ng-click="clear()" class="btn btn-primary">清空</button>'+
				'<button ng-show="!isEdit" type="button" ng-click="save()" class="btn btn-success">保存</button>'+
				'<button ng-show="!isEdit" type="button" ng-click="cancel()" class="btn btn-danger">取消</button>'+
				'</a></div>\
				<div class="input-group">\
			      <input type="text" class="form-control" ng-model="query" placeholder="城市/街道..">\
			      <span class="input-group-btn">\
			        <button class="btn btn-default" ng-click="search()" type="button">Go!</button>\
			      </span>\
			    </div>\
				</div></div>',
			plain: true,
			width:'100%',
			$scope:{},
		    controller: ['$scope', function($scope, element, attrs) {
		    	
		    	$scope.showEdit = !opts.readonly;
		    	overlay = undefined;
		    	var drawingManager = {};

		        var styleOptions= {
			            strokeColor:"red",      //边线颜色。
			            fillColor:"red",        //填充颜色。当参数为空时，圆形将没有填充效果。
			            strokeWeight: 3,        //边线的宽度，以像素为单位。
			            strokeOpacity: 0.8,     //边线透明度，取值范围0 - 1。
			            fillOpacity: 0.3,       //填充的透明度，取值范围0 - 1。
			            strokeStyle: 'solid'    //边线的样式，solid或dashed。
			    };
		        var local = null;
		        $timeout(function(){
		        	map = new BMap.Map('map_qb1',{enableMapClick:false});
		        	
			    	//map.setMapStyle(cacheService.getMapStyle());
			        map.centerAndZoom(opts.center, opts.zoom);
			        map.enableScrollWheelZoom();
			        
			        drawingManager = new BMapLib.DrawingManager(map, {
			            isOpen: false, //是否开启绘制模式
			            enableDrawingTool: false,
			            polygonOptions:styleOptions
			        });
			        drawingManager.enableGeoUtils();
			        drawingManager.addEventListener('overlaycomplete', drawComplete);
			        
			        if(overlay){			        	
			        	map.setViewport(overlay.getPath());		
			        	map.addOverlay(overlay);	
			        }
			        

			    	//位置检索
			    	$scope.query = "";
			    	var options = {renderOptions:{map:map,selectFirstResult:true,autoViewport:true}};
		    		local = new BMap.LocalSearch(map, options);	 
		        }, 500);
		        
		        if(opts.initPoints){
		        	var polygonPath = JSON.parse(opts.initPoints);
		        	var points = [];
		        	for(var item in polygonPath){
		        		points.push(new BMap.Point(polygonPath[item].lng, polygonPath[item].lat));
		        	}
		        	if(opts.type == 1)
		        		overlay = new BMap.Polygon(points, styleOptions);	
		        	else if(opts.type == 2)
		        		overlay = new BMap.Polyline(points, styleOptions);
		        }	
		        
		        var drawComplete = function(e){
		        	e.overlay.enableEditing();
		        	overlay = e.overlay;
		        	$scope.$apply(function(){
		        		$scope.isEdit = true;
		        	})
		        }
		        
		        $scope.isEdit = false;
		        $scope.goEdit = function(){
		        	if($scope.isEdit == false ){
		        		if(!overlay){//添加新的路线
		        			drawingManager.open();
		        			if(opts.type == 1)
		        				drawingManager.setDrawingMode('polygon');
		        			else if(opts.type == 2)
		        				drawingManager.setDrawingMode('polyline');
		        		}
		        		else{//修改已经存在的路线
		        			overlay.enableEditing();
		        			$scope.isEdit = true;
		        		}
		        		startEdit();
		        	}
		        	else{			        		
		        		drawingManager.close();
		        		if(overlay){
		        			overlay.disableEditing();
		        			$scope.isEdit = false;
		        		}		
		        		endEdit();
		        	}
		        }
		        

	        	var label = null;
	        	var showAlert = function(e){			        	
		        	if(!label){
		        		var opts = {position : e.point,offset: new BMap.Size(10, 10)}
			        	label = new BMap.Label("双击完成编辑~", opts);  // 创建文本标注对象
			        	label.setStyle({color : "red",
			        					 fontSize : "12px",
			        					 height : "20px",
			        					 lineHeight : "20px",
			        					 fontFamily:"微软雅黑"
			        				 	});
			        	map.addOverlay(label); 
		        	}
		        	else{
		        		label.setPosition(e.point);
		        	}
		        }
		        var hideAlert = function(){
		        	if(label)label.hide();
		        }
		        var startEdit = function(){
			        
			        map.addEventListener('mousemove', showAlert);
			        map.addEventListener('mouseout', hideAlert);
		        }			        
		        var endEdit = function(){
		        	map.removeEventListener('mousemove', showAlert);
			        map.removeEventListener('mouseout', hideAlert);
			        if(label){
			        	map.removeOverlay(label);
			        	label = null;
			        }
		        }
		        
		        $scope.delOnePoint = function(){
		        	if(overlay){
		        		path = angular.copy(overlay.getPath());
		        		if(path.length > 2)
		        		{
		        			path.pop();
		        			overlay.setPath(path);
		        		}
		        		else
		        			$scope.clear();
		        	}       	
		        }
		        
		        $scope.clear = function(){
		        	if(overlay){
		        		overlay.getMap().clearOverlays();
		        		$scope.isEdit = false;
		        		overlay = null;
		        	}
		        }
		        
		        $scope.save = function(){
		        	
			        if(overlay){
			        	var result = {data:0}
				        if(opts.type ===2)
				        	result.data = BMapLib.GeoUtils.getPolylineDistance(overlay);
	                    else if(opts.type ===1){
	                    	var pts = [];
	                    	var tempPts = overlay.getPath();
	                    	var Count = tempPts.length;
	                    	pts.push(tempPts[0]);
	                        for (var i = 1; i < Count; i++) {
	                        	if(tempPts[i].lat != tempPts[i-1].lat || tempPts[i].lon != tempPts[i-1].lon){
	                        		pts.push(tempPts[i]);
	                        	}
	                        }
	                    	result.data = BMapLib.GeoUtils.getPolygonArea(pts);
	                    }
	                    	
			        	result.position = JSON.stringify( overlay.getPath() )
			        	if(typeof result.data == 'undefined' || result.data == null)
			        		result.data = 0;
			        	else{
			        		console.log(result.data);
			        		result.data = parseInt(result.data);
			        		//result.data = parseInt(result.data) + parseInt((result.data - parseInt(result.data))*100)/100.0;
			        		console.log(result.data);
			        	}
			    		//opts.saveCallback(result);
		        	}
			        opts.saveCallback(result);
		    		ngDialog.closeAll();
		    	}
		    	
		    	$scope.cancel = function(){
		    		ngDialog.closeAll()
		    	}
		    	   		
		    	$scope.search = function(){
	    			local.clearResults()
		    		if($scope.query != '' && local != null){
		    			local.search($scope.query);
		    		} 		    		
		    	}
		    	
		        $scope.$on('$destroy',function(){
		        	if(element) element.remove();
		        });
		    }],
		    preCloseCallback: function(value) {
		    			    	
		        return true;
		    }
		
		});
	}
	
	return{open: openMap};

} ]);