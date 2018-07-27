/**
 * 地图打点
 */
app.service('showRouteService', [ 'ngDialog','$timeout','cacheService', function(ngDialog,$timeout,cacheService) {
	
	var defaultOpts = {	routes:null,
						type:0,//0 路线 1 区域
						center:new BMap.Point(116.404,39.915),//地图初始化中心
						width:'70%',//地图宽度
						zoom: false,//地图点击，是否获取缩放比例
						};
	var styleOptions= {
            strokeColor:"red",      //边线颜色。
            fillColor:"red",        //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,        //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,     //边线透明度，取值范围0 - 1。
            fillOpacity: 0.3,       //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid'    //边线的样式，solid或dashed。
    };
	var openMap = function(opts){
		
		//初始化参数
		opts = opts || defaultOpts;
		opts.center = opts.center || defaultOpts.center;
		opts.type = opts.type || defaultOpts.type;
		opts.width = opts.width || defaultOpts.width;
		opts.zoom = opts.zoom || defaultOpts.zoom;
		//opts.routes = opts.routes || defaultOpts.routes;
		
		//显示地图
		ngDialog.open({
		    template: '<div class="map_normal_route"><div id="map_qb1"></div></div>',
			plain: true,
			width:opts.width,
		    controller: ['$scope', function() {
		    	
		    	
		    	
		    	$timeout(function(){
		        	map = new BMap.Map('map_qb1',{enableMapClick:false});
			        
			        map.centerAndZoom(opts.center, 16);
			        map.enableScrollWheelZoom();
			        //map.setMapStyle(cacheService.getMapStyle());
			        var viewPoints = []
			        if(opts.routes && opts.routes.length > 0){
			        	
			        	angular.forEach(opts.routes,function(item){
			        		var polylinePath = JSON.parse(item.points);
			        		var overlay = null;
				        	var points = [];
				        	for(var i in polylinePath){
				        		var p = new BMap.Point(polylinePath[i].lng, polylinePath[i].lat);
				        		points.push(p);
				        		viewPoints.push(p);
				        	}
				        	if(opts.type == 0)
				        		overlay = new BMap.Polyline(points, styleOptions);	
				        	else
				        		overlay = new BMap.Polygon(points, styleOptions);
				        	map.addOverlay(overlay);
				        	var label = new BMap.Label(item.name,{offset:new BMap.Size(1,-1),position:points[0]});
				        	map.addOverlay(label);
			        	});	  
			        	
			        	map.setViewport(viewPoints);
			        }
			        
		        }, 500);
		    }]
		});		
	}
	
	return{open: openMap};

} ]);