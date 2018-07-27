/**
 *  A directive which helps you easily show a baidu-map on your page.
 *
 *
 *  Usages:
 *
 *      <baidu-map options='options'></baidu-map>
 *
 *      options: The configurations for the map
 *            .center.longitude[Number]{M}: The longitude of the center point
 *            .center.latitude[Number]{M}: The latitude of the center point
 *            .zoom[Number]{O}:         Map's zoom level. This must be a number between 3 and 19
 *            .navCtrl[Boolean]{O}:     Whether to add a NavigationControl to the map
 *            .scaleCtrl[Boolean]{O}:   Whether to add a ScaleControl to the map
 *            .overviewCtrl[Boolean]{O}: Whether to add a OverviewMapControl to the map
 *            .enableScrollWheelZoom[Boolean]{O}: Whether to enableScrollWheelZoom to the map
 *            .city[String]{M}:         The city name which you want to display on the map
 *            .markers[Array]{O}:       An array of marker which will be added on the map
 *                   .longitude{M}:                The longitude of the marker
 *                   .latitude{M}:                 The latitude of the marker
 *                   .icon[String]{O}:             The icon's url for the marker
 *                   .width[Number]{O}:            The icon's width for the icon
 *                   .height[Number]{O}:           The icon's height for the icon
 *                   .title[String]{O}:            The title on the infowindow displayed once you click the marker
 *                   .content[String]{O}:          The content on the infowindow displayed once you click the marker
 *                   .enableMessage[Boolean]{O}:   Whether to enable the SMS feature for this marker window. This option only available when title/content are defined.
 *
 *  @author      Howard.Zuo
 *  @copyright   Jun 9, 2015
 *  @version     1.2.0
 *
 *  @author fenglin han
 *  @copyright 6/9/2015
 *  @version 1.1.1
 * 
 *  Usages:
 *
 *  <baidu-map options='options' ></baidu-map>
 *  comments: An improvement that the map should update automatically while coordinates changes
 *
 *  @version 1.2.1
 *  comments: Accounding to 史魁杰's comments, markers' watcher should have set deep watch equal to true, and previous overlaies should be removed
 *
 */
(function(global, factory) {
    'use strict';

    if (typeof exports === 'object') {
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else {
        factory(global.angular);
    }

}(window, function(angular) {
    'use strict';

    var checkMandatory = function(prop, desc) {
        if (!prop) {
            throw new Error(desc);
        }
    };

    var defaults = function(dest, src) {
        for (var key in src) {
            if (dest != null && typeof dest[key] === 'undefined') {
                // console.log(dest[key])
                dest[key] = src[key];
            }
        }
    };
    
    
    
    var baiduMapDir = function($timeout) {

        // Return configured, directive instance

        return {
            restrict: 'E',
            scope: {
                options: '=',
                mapControl: '=',
                mapType: '=' //地图类型{replay：轨迹回放, monitor:实时监控}
            },
            link: function($scope, element, attrs) {
            	
                var defaultOpts = {
                    navCtrl: false,
                    scaleCtrl: false,
                    overviewCtrl: false,
                    enableScrollWheelZoom: true,
                    zoom: 10
                };

                var opts = $scope.options;

                defaults(opts, defaultOpts);

                checkMandatory(opts.center, 'options.center must be set');
                checkMandatory(opts.center.longitude, 'options.center.longitude must be set');
                checkMandatory(opts.center.latitude, 'options.center.latitude must be set');
                checkMandatory(opts.city, 'options.city must be set');

                // create map instance
//            	var map = new BMap.Map(document.getElementById("map_div"));
                var map = new BMap.Map(document.getElementById("map_qb"));

                // init map, set central location and zoom level
                map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);
                if (opts.navCtrl) {
                    // add navigation control
                    map.addControl(new BMap.NavigationControl());
                }
                if (opts.scaleCtrl) {
                    // add scale control
                    map.addControl(new BMap.ScaleControl());
                }
                if (opts.overviewCtrl) {
                    //add overview map control
                    map.addControl(new BMap.OverviewMapControl());
                }
                if (opts.enableScrollWheelZoom) {
                    //enable scroll wheel zoom
                    map.enableScrollWheelZoom();
                }
                // set the city name
                map.setCurrentCity(opts.city);
                
                if (!opts.markers) {
                    return;
                }
                //create markers

                var previousMarkers = [];
                var viewPoints = [];
                var openInfoWindow = function(infoWin) {
                    return function() {
                        this.openInfoWindow(infoWin);
                    };
                };

                var mark = function() {

                    var i = 0;

                    for (i = 0; i < previousMarkers.length; i++) {
                        previousMarkers[i].removeEventListener('click', opts.clickCallback);
                        map.removeOverlay(previousMarkers[i]);
                    }
                    previousMarkers.length = 0;
                    viewPoints = [];
                    for (i = 0; i < opts.markers.length; i++) {
                        var marker = opts.markers[i];
                        var pt = new BMap.Point(marker.longitude, marker.latitude);
                        viewPoints.push(pt);
                        var marker2;
                        if (marker.icon) {
                            var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
                            marker2 = new BMap.Marker(pt, {
                                icon: icon
                            });
                        } else {
                            marker2 = new BMap.Marker(pt);
                        }
                        marker2.mobileNumber = opts.markers[i].mobileNumber;
                        // add marker to the map
                        map.addOverlay(marker2);
                        previousMarkers.push(marker2);                       
                        
                        var label = new BMap.Label(marker.title,{offset:new BMap.Size(20,-10)});
                    	marker2.setLabel(label);
                    	if(opts.clickCallback){
                    		marker2.addEventListener('click', opts.clickCallback);
                    	}
                    }
                    if(viewPoints && viewPoints.length > 0)
                    	map.setViewport(viewPoints);
                };                

                mark();

                $scope.$watch('options.center', function(newValue, oldValue) {
                    opts = $scope.options;
                    map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);
                    mark();

                }, true);

                $scope.$watch('options.markers', function(newValue, oldValue) {
                    mark();
                }, true);
                 
        		$scope.mapControl = {};
        		if($scope.mapType=='replay'){
            		var iconA = new BMap.Icon('img/arrow_right.png', new BMap.Size(25,25),{anchor : new BMap.Size(8, 18)});
            		var iconC = new BMap.Icon('img/top_tu_che.png', new BMap.Size(60,60),{anchor : new BMap.Size(15, 15)});
            		var iconQ = new BMap.Icon('img/qidian.png', new BMap.Size(45,55), {imageOffset: new BMap.Size(0,-5)});
            		var iconE = new BMap.Icon('img/zhongdian.png', new BMap.Size(45,55), {imageOffset: new BMap.Size(0,-5)});
            		var iconS = new BMap.Icon('img/arrow_right.png', new BMap.Size(1,1));
            		var iconP = new BMap.Icon('img/tingche.png', new BMap.Size(25,25),{anchor : new BMap.Size(8, 18)});
            		var iconO = new BMap.Icon('img/chaosu.png', new BMap.Size(25,25),{anchor : new BMap.Size(8, 18)});
            		var iconDirects = [new BMap.Icon('img/zq_che1.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)}),
            		                   new BMap.Icon('img/zq_che2.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)}),
            		                   new BMap.Icon('img/zq_che3.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)}),
            		                   new BMap.Icon('img/zq_che4.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)}),
            		                   new BMap.Icon('img/zq_che5.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)}),
            		                   new BMap.Icon('img/zq_che6.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)}),
            		                   new BMap.Icon('img/zq_che7.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)}),
            		                   new BMap.Icon('img/zq_che8.png', new BMap.Size(52,49), {imageOffset: new BMap.Size(0,-5)})
            		                   ];
            		var replay = new Replay(map, [],{
            											arrowIcon:iconA, 
            											carIcon:iconC, 
            											directions:iconDirects,
            											startIcon:iconQ, 
            											endIcon:iconE,
            											shadowIcon:iconS,
            											parkingIcon:iconP,
            											overspeedIcon:iconO,
            											speed:1000
            										});

            		if($scope.mapControl)
            			$scope.mapControl.replay = replay;
            		//$timeout(function(){replay.load();} ,10);
            		//$timeout(function(){replay & replay.start();},3000);
            		$scope.$on("$destroy", function(){
            			if($scope.mapControl)
                			$scope.mapControl = null;
            			if(element)
            				element.remove();
            			$scope.$watch('options.center');
            			$scope.$watch('options.markers');
            		})
        		}
            },
            template: '<div id="map_qb" style=""></div>'
        };
    };

    var baiduMap = angular.module('baiduMap', []);
    baiduMap.directive('baiduMap', ['$timeout',baiduMapDir]);
}));