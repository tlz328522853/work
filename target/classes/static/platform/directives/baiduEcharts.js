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
            if (typeof dest[key] === 'undefined') {
                // console.log(dest[key])
                dest[key] = src[key];
            }
        }
    };
    
    
    
    var baiduEchartsDir = function() {

        // Return configured, directive instance

        return {
            restrict: 'E',
            scope: {
                ngOpt:'='
            },
            link: function($scope, element, attrs) {
        		
            	// 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(element.find('div')[0]);
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption($scope.ngOpt);
            },
            template: '<div id="map_qb" style="position: inherit;"></div>'
        };
    };

    var baiduEcharts = angular.module('baiduEcharts', []);
    baiduEcharts.directive('baiduEcharts', [baiduEchartsDir]);
}));