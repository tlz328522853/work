/**
 * 地图打点
 */
app.service('getPositionService', [ 'ngDialog','$timeout', function(ngDialog,$timeout) {
	
	var defaultOpts = {	initPoint:null,
						center:new BMap.Point(116.404,39.915),//地图初始化中心
						width:'100%',//地图宽度
						clickCallback: null,//地图点击回调函数
						zoom: false,//地图点击，是否获取缩放比例
						closeCallback:null,//关闭地图回调函数
						geocoder:false};
	
	var openMap = function(opts, pointed){
		
		//初始化参数
		opts = opts || defaultOpts;
		opts.center = opts.center || defaultOpts.center;
		opts.width = opts.width || defaultOpts.width;
		opts.zoom = opts.zoom || defaultOpts.zoom;
		opts.initPoint = opts.initPoint || defaultOpts.initPoint;
		opts.geocoder = opts.geocoder || defaultOpts.geocoder;
		
		//显示地图
		ngDialog.open({
		    template: '<div class="map_normal_route">'+
			'<div id="map_qb1"></div>'+
			'<div class="map_route">'+
			'<div class="route_div">'+
			'<button  type="button" ng-click="save()" class="btn btn-success">保存</button>'+
			'<button  type="button" ng-click="clear()" class="btn btn-success">清空</button>'+
			'<button  type="button" ng-click="cancel()" class="btn btn-danger">取消</button>'+
			'</div><div class="input-group">\
		      <input type="text" class="form-control" ng-model="query" placeholder="城市/街道..">\
		      <span class="input-group-btn">\
		        <button class="btn btn-default" ng-click="search()" type="button">Go!</button>\
		      </span>\
		    </div>\
			</div></div>',
			plain: true,
			width:opts.width,
			$scope:{},
		    controller: ['$scope', function($scope,element,attrs) {
		    	
		    	var marker = null;
		    	
		    	$scope.save = function(){
		    		if (marker) {
		    			marker.zoom = map.getZoom();
		    		}
		    		opts.clickCallback(marker);
		    		ngDialog.closeAll();
		    	}
		    	
		    	$scope.cancel = function(){
		    		/*opts.clickCallbackCancel();*/
		    		ngDialog.closeAll()
		    	}
		    	$scope.clear = function(e){
		    		if(marker)
		    			map.removeOverlay(marker);
		    		marker=null;
		    	}
		    	
		    	$timeout(function(){
		        	map = new BMap.Map('map_qb1',{enableMapClick:false});
		        				        
			        map.centerAndZoom(opts.center, 16);
			        map.enableScrollWheelZoom();
			        
				    map.addEventListener("click",function(e){
				    					    	
			    		if(!marker){
			    			
			    			if(opts.initPoint){	
			    				var myIcon = new BMap.Icon("img/arrow_right.png", new BMap.Size(23, 25), {   
				    				offset: new BMap.Size(10, 25)
				    			});      
				    			marker = new BMap.Marker(e.point, {icon: myIcon});
				    			map.addOverlay(marker);
			    			}
			    			else{
			    				marker = new BMap.Marker(e.point);
				    			map.addOverlay(marker);			 
			    			}
			    			   			
			    		}
			    		else{
			    			marker.setPosition(e.point);
			    		}
			    		if(opts.clickCallback){
				    		marker.zoom = map.getZoom();
				    	}
			    		if(opts.geocoder){
			    			var geoc = new BMap.Geocoder(); 
			    			geoc.getLocation(e.point,
			    				function(gr){
			    					marker.address = gr.address;
			    				}
			    			);
			    		}
			    	});			    
				    
				    //初始化
				    var marker2 = null;
			        if(opts.initPoint){	
			        	if (pointed && pointed instanceof Array) {
			        		marker2 = new BMap.Marker(new BMap.Point(opts.initPoint.longitude,opts.initPoint.latitude));
			        		map.addOverlay(marker2);		   
			        		map.setViewport([marker2.getPosition()]);
			        	} else {
			        		marker = new BMap.Marker(new BMap.Point(opts.initPoint.longitude,opts.initPoint.latitude));
			        		map.addOverlay(marker);		   
			        		map.setViewport([marker.getPosition()]);
			        	}
			        };
			        if(pointed && pointed instanceof Array){
			        	for (var item in pointed) {
			        		var p = pointed[item];
			        		
			        		var myIcon = new BMap.Icon("img/arrow_right.png", new BMap.Size(23, 25), {   
			    				offset: new BMap.Size(10, 25)
			    			});      
			        		marker2 = new BMap.Marker(new BMap.Point(p.longitude,p.latitude), {icon: myIcon});
			    			map.addOverlay(marker2);
			    			
			        	/*	marker2 = new BMap.Marker(new BMap.Point(p.longitude,p.latitude));
			        		map.addOverlay(marker2);*/
			        		/*marker2 = new BMap.Marker(new BMap.Point(p.longitude,p.latitude));
			        		map.addOverlay(marker2);*/
			        	}
			        	map.panTo([marker2.getPosition()]);
			        };
			        if(opts.zoom){
			        	map.setZoom(opts.zoom);
			        }
			        
			        //位置检索
			    	$scope.query = "";
			    	var options = {renderOptions:{map:map,selectFirstResult:true,autoViewport:true}};
		    		local = new BMap.LocalSearch(map, options);	 
			        
		        }, 50);
		    	
		    	$scope.$on('$destroy',function(){
		        	if(element) element.remove();
		        });
		    	
		    	$scope.search = function(){
	    			local.clearResults()
		    		if($scope.query != '' && local != null){
		    			local.search($scope.query);
		    		} 		    		
		    	}
		    }],
		    preCloseCallback: function(value) {
		    	
		    	return true;
		    }
		});		
	}
	
	return{open: openMap};

} ]);