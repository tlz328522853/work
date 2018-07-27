angular.module('platform').controller('analysisController', ['$scope','requestService','$location', function($scope,requestService,$location) {
	
	//项目公司间切换
	//功能视图切换
	$scope.itemList = [{id:1,name:'进入平台'},{id:2,name:'显示地图'}];
	$scope.ngOptions={title:'决策统计'};
	//点击左上角项目公司名称，定位到项目公司监测点; 点击返回项目公司视图，回到全国地图视图
	$scope.ngOptions.itemClickCallback = function(id){		
		if(id == 1){//进入平台
			if($scope.hasVedioAccess) {
				$location.path('/home/envsanitation/32/comprehensive');
			}
			else{
				$location.path('/home/home/30/info');
			}			
		}			
		else if(id == 2){//进入决策统计
			$location.path('/home/home/30/map');
		}
	};
	
	//判断是否有综合监控权限
	(function(){
		url = "/security/checkUrl";
		params = {url:'home.sideMenu.comprehensive'};
		requestService.post(url,params,true).then(function(data){				
			$scope.hasVedioAccess = data.data == true?true:false;
		});
	}());
	
	
	
	//累积成本
	$scope.Cost = {
			title : {
		        text: '累积成本:3001',//拼接
		        subtext: '(单位:万元)',		        
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	x: 'center',  
		    	y: 'bottom',
		        data: ['环卫成本','物流成本','广告成本','再生资源成本']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '40%',
		            center: ['50%', '60%'],
		            data:[
		                {value:335, name:'环卫成本'},
		                {value:310, name:'物流成本'},
		                {value:234, name:'广告成本'},
		                {value:135, name:'再生资源成本'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
	};


	//累积应收
	$scope.Account = {
			title : {
		        text: '累积应收:406',//拼接
		        subtext: '(单位:万元)',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	x: 'center',  
		    	y: 'bottom',
		        data: ['剩余','收入']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '40%',
		            center: ['50%', '60%'],
		            data:[
		                {value:635, name:'剩余'},
		                {value:310, name:'收入'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
	};

	//累积实收
	$scope.Paid = {
			title : {
		        text: '累积实收:350',//拼接
		        subtext: '(单位:万元)',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	x: 'center',  
		    	y: 'bottom',
		        data: ['剩余','收入']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '40%',
		            center: ['50%', '60%'],
		            data:[
		                {value:635, name:'剩余'},
		                {value:310, name:'收入'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
	};
	
	//今年累计净利润
	$scope.profit = {
			title : {
		        text: '今年累计净利润:6621\n 去年累计净利润：4329',//拼接
		        subtext: '单位:万元',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    grid: { // 控制图的大小，调整下面这些值就可以，
        x: 40,
        x2: 50,
        y2: 80,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
    },
    yAxis : [
             {
                 type : 'value',
                 splitNumber:10,
                 min: 0,
                 max: 1000
             }
         ],
    series: [
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[550,550,120,412,600,576,870,509,645,570,580,590]
        },
        {
            name:'去年',
            type:'bar',
            itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
            data:[462,500,200,400,500,420,130,415,230,140,443,445]
        }
    ]
	};
	
	
	//人员对比分析
	$scope.Empcompare = {
			title : {
		        text: '人员对比分析',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
             {
                 type : 'value',
                 splitNumber:10,
                 min: 420,
                 max: 600,
                 data: ['420','440','460','480','500','520','540','560','580','600']
             }
         ],
    series: [
		{
		    name:'去年',
		    type:'bar',
		    itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
		    data:[560, 562,550,540,550,558, 562,564,560,569, 574,572]
		},
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[480, 500, 520, 529, 522,525,529,535,530, 550,555, 560]
        }
        
    ]
	};
	
	//人员职务
	$scope.position = {
			title : {
		        text: '人员职务',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	x: 'center',  
		    	y: 'bottom',
		        data: ['后勤','综合管理','项目公司总经理','财务']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '40%',
		            center: ['50%', '60%'],
		            data:[
		                {value:435, name:'后勤'},
		                {value:235, name:'综合管理'},
		                {value:135, name:'项目公司总经理'},
		                {value:210, name:'财务'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
	};
	
	//员工年龄
	$scope.age = {
			title : {
		        text: '员工年龄',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	x: 'center',  
		    	y: 'bottom',
		        data: ['50岁以上','40-49岁','30-39岁','29岁以下']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '40%',
		            center: ['50%', '60%'],
		            data:[
		                {value:435, name:'50岁以上'},
		                {value:235, name:'40-49岁'},
		                {value:135, name:'30-39岁'},
		                {value:210, name:'29岁以下'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
	};
	
	//今年资产累计金额
	$scope.assets = {
			title : {
		        text: '今年资产累计金额:6621\n 去年资产累计金额：4329',//拼接
		        subtext: '单位:万元',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            splitNumber:10,
            min: 420,
            max: 600,
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
             {
                 type : 'value'
             }
         ],
    series: [
		{
		    name:'去年',
		    type:'bar',
		    itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
		    data:[480,500,520,530,520,525,530,535,530,550,557,560]
		},
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[560,562,550,540,550,558,562,563,560,570,578,575]
        }
        
    ]
	};
	
	//车辆统计
	$scope.car = {
			title : {
		        text: '车辆统计',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data: ['管理用车','清运车','机扫车','清洗车','清洗机','清洁车','除雪机','电动车','铲车','除雪车' ,'保洁车','养护车']
		    },
		    series : [
		  	        {
		  	            name: '访问来源',
		  	            type: 'pie',
		  	            radius : '40%',
			            center: ['50%', '60%'],
		  	            data:[
		  	                {value:57, name:'管理用车'},
		  	                {value:117, name:'机扫车'},
		  	                {value:101, name:'清洗车'},
		  	                {value:1, name:'清洗机'},
		  	                {value:43, name:'清洁车'},
		  	                {value:0, name:'除雪机'},
		  	                {value:53, name:'电动车'},
		  	                {value:3, name:'铲车'},
		  	                {value:4, name:'除雪车'},
		  	                {value:0, name:'保洁车'},
		  	        		{value:32, name:'养护车'},
		  	            ],
		  	            itemStyle: {
		  	                emphasis: {
		  	                    shadowBlur: 10,
		  	                    shadowOffsetX: 0,
		  	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		  	                }
		  	            }
		  	        }
		  	    ]
	};
	
	//环卫设施统计
	$scope.equipment = {
			title : {
		        text: '环卫设施统计',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data: ['垃圾桶','果皮箱','环卫亭','垃圾焚烧厂','垃圾中转站','垃圾填埋厂','垃圾箱','露天斗','公厕']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '40%',
		            center: ['50%', '60%'],
		            data:[
		                {value:96, name:'垃圾桶'},
		                {value:296, name:'果皮箱'},
		                {value:539, name:'环卫亭'},
		                {value:0, name:'垃圾焚烧厂'},
		                {value:92, name:'垃圾中转站'},
		                {value:0, name:'垃圾填埋厂'},
		                {value:60, name:'垃圾箱'},
		                {value:0, name:'露天斗'},
		                {value:3, name:'公厕'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
	};
	
	//项目公司数量近两年对比
	$scope.number = {
			title : {
		        text: '项目公司数量近两年对比',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
             {
                 type : 'value',
                 splitNumber:6,
                 min: 0,
                 max: 120,
             }
         ],
    series: [
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[90,91,92,93,96,97,98,99,100,101,102,103]
        },
        {
            name:'去年',
            type:'bar',
            itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
            data:[80,81,82,83,84,85,87,88,89,90,91,93]
        }
    ]
	};
	
	//服务人口近两年对比
	$scope.population = {
			title : {
		        text: '服务人口近两年对比',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
             {
                 type : 'value'
             }
         ],
    series: [
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[90,91,92,93,96,97,98,99,100,101,102,103]
        },
        {
            name:'去年',
            type:'bar',
            itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
            data:[80,81,82,83,84,85,87,88,89,90,91,93]
        }
    ]
	};
	
	//垃圾清运量近两年对比
	$scope.empty = {
			title : {
		        text: '垃圾清运量近两年对比',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
             {
                 type : 'value'
             }
         ],
    series: [
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[90,91,92,93,96,97,98,99,100,101,102,103]
        },
        {
            name:'去年',
            type:'bar',
            itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
            data:[80,81,82,83,84,85,87,88,89,90,91,93]
        }
    ]
	};
	
	//绿化带保洁面积近两年对比
	$scope.belts = {
			title : {
		        text: '绿化带保洁面积近两年对比',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
             {
                 type : 'value'
             }
         ],
    series: [
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[90,91,92,93,96,97,98,99,100,101,102,103]
        },
        {
            name:'去年',
            type:'bar',
            itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
            data:[80,81,82,83,84,85,87,88,89,90,91,93]
        }
    ]
	};
	
	//绿化带保洁面积近两年对比
	$scope.Clean = {
			title : {
		        text: '清扫保洁面积近两年对比',
		        x:'center',
		        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#474747',
                    fontSize:16
                }
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
    legend: {
    	x: 'center',  
    	y: 'bottom',
        data:['去年','今年']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
             {
                 type : 'value'
             }
         ],
    series: [
        {
            name:'今年',
            type:'bar',
            barWidth:5,
            itemStyle:{  
                normal:{   
                       color:'rgba(255, 0, 0,0.9)' //刚才说的图例颜色设置  
                }
            }, 
            data:[90,91,92,93,96,97,98,99,100,101,102,103]
        },
        {
            name:'去年',
            type:'bar',
            itemStyle:{  
                normal:{   
                       color:'rgba(30, 144, 255,0.8)' //刚才说的图例颜色设置  
                } 
            }, 
            data:[80,81,82,83,84,85,87,88,89,90,91,93]
        }
    ]
	};
	
	//机械化作业率
	$scope.working = {
			tooltip : {
		        formatter: "{a} <br/>{b} : {c}%"
		    },
		    /*grid: { // 控制图的大小，调整下面这些值就可以，
		        x: 40,
		        x2: 50,
		        y2: 50,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
		    },*/
		    series : [
		        {
		            name:'业务指标',
		            type:'gauge',
		            startAngle: 180,
		            endAngle: 0,
		            center : ['50%', '95%'],    // 默认全局居中
		            radius : 180,
		            axisLine: {            // 坐标轴线
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    width: 100
		                }
		            },
		            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
		                formatter: function(v){
		                    switch (v+''){
		                        case '10': return '低';
		                        case '50': return '中';
		                        case '90': return '高';
		                        default: return '';
		                    }
		                },
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    color: '#fff',
		                    fontSize: 15,
		                    fontWeight: 'bolder'
		                }
		            },
		            pointer: {
		                width:50,
		                length: '70%',
		                color: 'rgba(255, 255, 255, 0.1)'
		            },
		            title : {
		                show : true,
		                offsetCenter: [0, '-60%'],       // x, y，单位px
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    color: '#fff',
		                    fontSize: 16
		                }
		            },
		            detail : {
		                show : true,
		                backgroundColor: 'rgba(0,0,0,0)',
		                borderWidth: 0,
		                borderColor: '#ccc',
		                width: 100,
		                height: 40,
		                offsetCenter: [0, -40],       // x, y，单位px
		                formatter:'{value}%',
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    fontSize : 20,
		                    color:'#fff'
		                }
		            },
		            data:[{value: 50, name: '机械化作业率'}]
		        }
		    ]
		};
	
	
	var carCostOption = {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: ['管理用车','清运车','机扫车','清洗车','清洗机','清洁车','除雪机','电动车','铲车','除雪车' ,'保洁车','养护车']
	    },
	    series : [
	        {
	            name: '清运车',
	            type: 'pie',
	            radius : '63.45%',
	            data:[
	                {value:57, name:'管理用车'},
	                {value:117, name:'机扫车'},
	                {value:101, name:'清洗车'},
	                {value:1, name:'清洗机'},
	                {value:43, name:'清洁车'},
	                {value:0, name:'除雪机'},
	                {value:53, name:'电动车'},
	                {value:3, name:'铲车'},
	                {value:4, name:'除雪车'},
	                {value:0, name:'保洁车'},
	        		{value:32, name:'养护车'},
	            ],
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	
	var carCostReload = function(){
		var url = "/envsanitation/api/analysisReport/carCountReport";
		var params = {
				orgId :21,
		}
		for(var item in params){
			if(params[item] == undefined){
				delete params[item];
			}
		}
		requestService.post(url, params).then(
			function(data){
				if(data.code==200 && data.success==true){
					carCostRefresh(data.data)
				}else{
					console.log(data);
				}
			},function(error){
				console.log(error);
			}
		)
	}
	carCostReload();
	var carCostRefresh = function(chardata){
		var carCost = echarts.init(document.getElementById("carCost"));
		carCostOption.series[0].data = chardata;
		carCostOption.legend.data= chardata;
		carCost.setOption(carCostOption);
	}
	
	$scope.carCost = carCostOption;
	//车辆构成表结构
	var carCountOption = {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: ['管理用车','清运车','机扫车','清洗车','清洗机','清洁车','除雪机','电动车','铲车','除雪车' ,'保洁车','养护车']
	    },
	    series : [
	        {
	            name: '清运车',
	            type: 'pie',
	            radius : '49.22%',
	            data:[
	                {value:3090827, name:'管理用车'},
	                {value:40886550, name:'机扫车'},
	                {value:27448234, name:'清洗车'},
	                {value:650000, name:'清洗机'},
	                {value:15920000, name:'清洁车'},
	                {value:0, name:'除雪机'},
	                {value:195100, name:'电动车'},
	                {value:615000, name:'铲车'},
	                {value:2619600, name:'除雪车'},
	                {value:0, name:'保洁车'},
	        		{value:2713837.8, name:'养护车'},
	            ],
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	//车辆构成报表重载
	var carCountReload = function(){
		var url = "/envsanitation/api/analysisReport/carCountReport";
		var params = {
				orgId :21,
		}
		for(var item in params){
			if(params[item] == undefined){
				delete params[item];
			}
		}
		requestService.post(url, params).then(
			function(data){
				if(data.code==200 && data.success==true){
					carCountRefresh(data.data)
				}else{
					console.log(data);
				}
			},function(error){
				console.log(error);
			}
		)
	}
	carCountReload();
	//车辆报表数据刷新
	var carCountRefresh = function(chardata){
		var carCount = echarts.init(document.getElementById("carCount"));
		carCountOption.series[0].data = chardata;
		carCountOption.legend.data= chardata;
		carCount.setOption(carCountOption);
	}
	
	$scope.carCount=carCountOption;
	// 环卫设施构成统计表
	var facilityCountOption = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data: ['垃圾桶','果皮箱','环卫亭','垃圾焚烧厂','垃圾中转站','垃圾填埋厂','垃圾箱','露天斗','公厕']
		    },
		    series : [
		        {
		            name: '垃圾桶',
		            type: 'pie',
		            radius : '50%',
		            data:[
		                {value:296, name:'果皮箱'},
		                {value:539, name:'环卫亭'},
		                {value:0, name:'垃圾焚烧厂'},
		                {value:92, name:'垃圾中转站'},
		                {value:0, name:'垃圾填埋厂'},
		                {value:60, name:'垃圾箱'},
		                {value:0, name:'露天斗'},
		                {value:3, name:'公厕'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
	}
	//设施表数据加载
	var facilityCountReload = function(){
		var url = "/envsanitation/api/analysisReport/facilityCountReport";
		var params = {
				orgId :21,
		}
		for(var item in params){
			if(params[item] == undefined){
				delete params[item];
			}
		}
		requestService.post(url, params).then(
			function(data){
				if(data.code==200 && data.success==true){
					facilityRefresh(data.data)
				}else{
					console.log(data);
				}
			},function(error){
				console.log(error);
			}
		)
	}
	facilityCountReload();
	//设施表更新
	var facilityRefresh = function(chardata){
		var facility = echarts.init(document.getElementById("facility"));
		facilityCountOption.series[0].data = chardata;
		facilityCountOption.legend.data= chardata;
		facility.setOption(facilityCountOption);	
	}
	//设施表数据绑定
	$scope.facility=facilityCountOption;
	
	// 职工年龄构成表
	var empAgeChartOption = {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: ['40岁以下','40-49岁','50-59岁','60岁以上']
	    },
	    series : [
	        {
	            name: '60岁以上',
	            type: 'pie',
	            radius : '50%',
	            data:[],
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	}
	//职工年龄数据重载
	function empAgeReload(){
		var url = "/envsanitation/api/analysisReport/employeeAgeReport";
		var params = {
				orgId :21,
		}
		for(var item in params){
			if(params[item] == undefined){
				delete params[item];
			}
		}
		requestService.post(url, params).then(
			function(data){
				if(data.code==200 && data.success==true){
					empAgeRefresh(data.data)
				}else{
					console.log(data);
				}
			},function(error){
				console.log(error);
			}
		)
		
	}
	empAgeReload();
	
	var empAgeRefresh = function(chardata){
		var age = echarts.init(document.getElementById("empAge"));
		empAgeChartOption.series[0].data = chardata;
		empAgeChartOption.legend.data= chardata;
		age.setOption(empAgeChartOption);	
	}
	
	$scope.empAge=empAgeChartOption
	
	
	// 职工性别构成表
	var empGenderCharOption = {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: ['男','女']
	    },
	    series : [
	        {
	            name: '职工性别构成',
	            type: 'pie',
	            radius : '50%',
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	function empGenderReload(){
		var url = "/envsanitation/api/analysisReport/employeeGenderReport";
		var params = {
				orgId :21,
		}
		for(var item in params){
			if(params[item] == undefined){
				delete params[item];
			}
		}
		requestService.post(url, params).then(
			function(data){
				if(data.code==200 && data.success==true){
					empGenderComposeRefresh(data.data)
				}else{
					console.log(data);
				}
			},function(error){
				console.log(error);
			}
		)
		
	}
	empGenderReload();
	
	var empGenderComposeRefresh = function(chardata){
		var gender = echarts.init(document.getElementById("gender"));
		empGenderCharOption.series[0].data = chardata;
		empGenderCharOption.legend.data= chardata;
		gender.setOption(empGenderCharOption);	
	}
	
	$scope.empGenderCompose=empGenderCharOption;
}]);