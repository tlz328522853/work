/**
 * 地图打点
 */
app.service('showDetailService', 
		[ 'ngDialog', '$timeout', '$templateCache', 
          function(ngDialog, $timeout, $templateCache) {
	
	
	/**
	 * opts
	 * type['emp','car']
	 * target
	 */
	var openForm = function(opts){
		
		//显示信息
		ngDialog.open({
		    template: $templateCache.get(opts.type),
			plain: true,
			width:'40%',
		    controller: ['$scope', function($scope) {
		    	
		    	$scope.target = opts.target;
		    	
		    }]
		});		
	}
	
	$templateCache.put('emp', '<div id="info_box" class="panel panel-primary" style="margin-bottom: 0px;height: inherit">\
			<div class="panel-heading"><h1 class="panel-title">人员详细信息</h1></div>\
			<div class="panel-body">\
			<dl class="dl-horizontal">\
			    <dt>工号</dt><dd>{{target.employeeNo}}</dd>\
			    <dt>姓名</dt><dd>{{target.name}}</dd>\
			    <dt>性别</dt><dd>{{target.gender}}</dd>\
				<dt>职务</dt>\<dd>{{ target.jobTitle | dicFilter:"7846845230464623" }}</dd>\
				<dt>办公电话</dt><dd>{{ target.telephone }}</dd>\
				<dt>手机</dt><dd>{{ target.mobile }}</dd>\
				<dt>机构/部门</dt><dd>{{ target.org.name }}</dd>\
				<dt>住址</dt>    <dd>{{ target.address }}</dd>                                 \
				<dt>微信</dt>    <dd>{{ target.weChat }}</dd>                                  \
				<dt>出生日期</dt><dd>{{ target.birthday   | date:"yyyy-MM-dd"}}</dd>           \
				<dt>学历</dt>    <dd>{{ target.education | dicFilter:"4052776293517273"}}</dd> \
				<dt>身份证号</dt><dd>{{ target.identNo }}</dd>                                 \
				<dt>邮箱</dt>    <dd>{{ target.email }}</dd>                                   \
				<dt>毕业学校</dt><dd>{{ target.gradCollege }}</dd>                             \
				<dt>毕业时间</dt><dd>{{ target.gradDate  | date:"yyyy-MM-dd"}}</dd>            \
				<dt>入职日期</dt>      <dd>{{ target.entryDate  | date:"yyyy-MM-dd"}}</dd>               \
				<dt>离职日期</dt>      <dd>{{ target.deparddate  | date:"yyyy-MM-dd"}}</dd>              \
				<dt>学科专业</dt>      <dd>{{ target.major | dicFilter:"2637396118320784"}}</dd>         \
				<dt>政治面貌</dt>      <dd>{{ target.politicsStatus | dicFilter:"5169643214488397"}}</dd>\
				<dt>通讯卡号</dt>      <dd>{{ target.mobileMac }}</dd>                                   \
				<dt>专业职称</dt>      <dd>{{ target.profession | dicFilter:"4285545309945913"}}</dd>    \
				<dt>技术等级</dt>      <dd>{{ target.techLevel | dicFilter:"5070939939490202"}}</dd>     \
				<dt>紧急联系人</dt>    <dd>{{ target.emergeName }}</dd>                                  \
				<dt>紧急联系人电话</dt><dd>{{ target.emergeMobile }}</dd>                                \
			</dl>\
			</div>\
			</div>');
	$templateCache.put('car', '<div id="info_box" class="panel panel-primary" style="margin-bottom: 0px;height: inherit">\
			<div class="panel-heading"><h1 class="panel-title">机动车辆详细信息</h1></div>\
			<div class="panel-body">\
			<dl class="dl-horizontal">\<dt>车牌号</dt>  <dd>{{ target.carNumber }}</dd>                                     \
			<dt>车辆编号</dt><dd>{{ target.carCode }}</dd>                                       \
			<dt>车辆名称</dt><dd>{{ target.carName }}</dd>                                       \
			<dt>车辆类型</dt><dd>{{ target.carType  | dicFilter:"8684056427607197"}}</dd>        \
			<dt>所属机构</dt><dd>{{ target.orgName }}</dd>                                       \
			<dt>通讯卡号</dt><dd>{{ target.cardNumber }}</dd>                                    \
			<dt>启用</dt>    <dd>{{ target.assetState | mapFilter:\'200,201,202,203,204,207,208,209\':\'是,否,否,否,否,否,否,否\'}}</dd>                          \
			<dt>审核状态</dt>	   <dd>{{ target.state | mapFilter:\'0,1,2\':\'未审核,已审核,取消审核\' }}</dd> \
			<dt>生产厂家</dt>    <dd>{{ target.manufacturer}}</dd>\
			<dt>发动机号</dt>    <dd>{{ target.engineNumber }}</dd>                              \
			<dt>底盘号</dt>      <dd>{{ target.chassisNumber }}</dd>                             \
			<dt>对应资产编号</dt><dd>{{ target.assetCode }}</dd>	                             \
			<dt>油箱容积</dt>	 <dd>{{ target.tankVolume }}</dd>                                \
			<dt>动力类型</dt>	 <dd>{{ target.dynamicType | dicFilter:"6632421903743608"}}</dd>     \
			<dt>整备质量/KG</dt>	<dd>{{ target.kerbMass }}</dd>                               \
			<dt>常规保养公里数</dt> <dd>{{ target.commonKilometers }}</dd>                       \
			<dt>载客人数</dt> <dd>{{ target.seats }}</dd> \
			<dt>单价</dt>	   <dd>{{ target.originalValue }}</dd>                                   \
			<dt>折旧结束日期</dt>	   <dd>{{ target.depreciationDate | date:"yyyy-MM-dd"}}</dd>   \
			</dl>\
			</div>\
			</div>');
	
	$templateCache.put('nonCar', '<div id="info_box" class="panel panel-primary" style="margin-bottom: 0px;">\
			<div class="panel-heading"><h1 class="panel-title">非机动车辆详细信息</h1></div>\
			<div class="panel-body">\
			<dl class="dl-horizontal">\<dt>车牌号</dt>  <dd>{{ target.carNumber }}</dd>                                     \
			<dt>车辆编号</dt><dd>{{ target.carCode }}</dd>                                       \
			<dt>车辆名称</dt><dd>{{ target.carName }}</dd>                                       \
			<dt>车辆类型</dt><dd>{{ target.carType  | dicFilter:"8684056427607198"}}</dd>        \
			<dt>所属机构</dt><dd>{{ target.orgName }}</dd>                                       \
			<dt>通讯卡号</dt><dd>{{ target.cardNumber }}</dd>                                    \
			<dt>启用</dt>    <dd>{{ target.assetState | mapFilter:\'200,201,202,203,204,207,208,209\':\'是,否,否,否,否,否,否,否\'}}</dd>                          \
			<dt>审核状态</dt>	   <dd>{{ target.state | mapFilter:\'0,1,2\':\'未审核,已审核,取消审核\'}}</dd>\
			<dt>生产厂家</dt>    <dd>{{ target.manufacturer}}</dd>\
			<dt>对应资产编号</dt><dd>{{ target.assetCode }}</dd>	                             \
			<dt>动力类型</dt>	 <dd>{{ target.dynamicType | dicFilter:"8976178938135027"}}</dd>     \
			<dt>品牌型号</dt>	<dd>{{ target.brandModel }}</dd>                                 \
			<dt>单价</dt>	   <dd>{{ target.originalValue }}</dd>\
			<dt>折旧结束日期</dt>	   <dd>{{ target.depreciationDate | date:"yyyy-MM-dd"}}</dd>   \
			</dl>\
			</div>\
			</div>');
	
	return{open: openForm};

} ]);