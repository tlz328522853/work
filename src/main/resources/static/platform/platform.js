var app, deps;
angular.module('findSelectTemp',[]);
deps = ['sideMenuModule','ngAnimate','topMenuModule','pwCheckModule',
        'ui.router','ngTouch', 'angularBootstrapNavTree','ngDialog',
        'lightGrid','ng-tree-selection','baiduMap','baiduEcharts','ng-fusioncharts',
        'ngRange','ngCookies','angularFileUpload','regionSelectTemp','platformRegionSelectTemp','findSelectTemp','fileUploadUI',
        'ngSelectCustomModule','ngNotificationsBar','ngTagsInput','ui.bootstrap',
        'datePickers','timePickers','ngLoadingModule','colorpicker.module', 'ngWYSIWYG',
        'ngDropdownModule','queryPanelSelect','ngFileUpload','customCaptchaModule','customXialaModule','myLunboModule','oc.lazyLoad','ui.select2',
		'checklistModel','regionSelectTemp','ngUeditor','emoji','angucomplete','ivh.treeview','treeShrinkModule','keditor','dropSelectModule'];

app = angular.module('platform', deps);
app.run(['$rootScope', '$state', '$stateParams','notifications','$cookieStore',
      	function ($rootScope, $state, $stateParams,notifications,$cookieStore) {
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;
				
				$rootScope.$on('$stateChangeStart', 
						function(event, toState, toParams, fromState, fromParams, options){
					if(fromParams&&fromState.name.lastIndexOf('home.sideMenu.')==0&&toState.name=='home.sideMenu'&&fromParams.moduleId==toParams.moduleId)
						event.preventDefault();
					if(['home.sideMenu.caroperation','home.sideMenu.employwork','home.sideMenu.equipment','home.sideMenu.event','home.sideMenu.comprehensive'].indexOf(toState.name)==-1){
						$cookieStore.remove('monitorOrgId');
					}
					notifications.closeAll();
					
				})
			}
		]);

app.config(['$controllerProvider','$compileProvider','$filterProvider','$provide','$stateProvider', '$urlRouterProvider','notificationsConfigProvider',
            function ($controllerProvider,$compileProvider,$filterProvider,$provide,$stateProvider, $urlRouterProvider,notificationsConfigProvider,$ocLazyLoadProvider) {

	notificationsConfigProvider.setHideDelay(1000);
	notificationsConfigProvider.setAutoHide(true);
	notificationsConfigProvider.setAcceptHTML(false);
	app.controllerProvider = $controllerProvider;
    app.compileProvider    = $compileProvider;
    app.filterProvider     = $filterProvider;
    app.provide            = $provide;
    
    


	$urlRouterProvider
		.when('/', '/home')
		.otherwise('/home');


	$stateProvider

		.state("home", {
	          url: "/home",
	          templateUrl: 'platform/html/index.html',
	          resolve: { 
	              loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
	            	  return $ocLazyLoad.load(['platform/controllers/homeController.js','platform/libs/mqtt/mqttws31.js']);
	              }]
	          },
			  controller:'homeController'
        })
        .state("home.sideMenu", {
	          url: "/:moduleName/:moduleId",
	          templateUrl: 'platform/html/home/side_menu.html',
	          resolve: { 
	              loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
	            	  return $ocLazyLoad.load(['platform/controllers/sideMenuController.js',
	            			  'platform/controllers/util/excelImportController.js']);
	              }]
	          },
	          controller:"sideMenuController"
        })

		
		.state("login", {
			url: "/login",
			templateUrl: 'platform/html/login.html',resolve: { 
	              loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
	            	  return $ocLazyLoad.load('platform/controllers/loginController.js');
	              }]
	        },
			controller:'loginController'
        })

		.state("register", {
          	url: "/register",
          	templateUrl: 'platform/html/register.html',
  	          resolve: { 
  	              loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
  	            	  return $ocLazyLoad.load(['platform/controllers/registerController.js',
  	            	                           'platform/controllers/selectPackageController.js']);
  	              }]
  	          },
  	          controller:'registerController'
       	})
    }
]);
app.directive('ensureUnique', ['requestService',
function(requestService) {
	return {
		require : 'ngModel',
		link : function(scope, ele, attrs, c) {
			scope.$watch(attrs.ngModel, function() {
				// var url = '/security/hasName';
				var url = attrs.url;
				if (!url || !c.$dirty) {
					return;
				}
				if (!c.$modelValue && attrs.url
						&& attrs.url != '/security/hasName') {
					c.$setValidity('unique', true);
					return;
				}
				if (attrs.url && attrs.url != '/security/hasName') {
					c.$setValidity('unique', false);
				}
				var param = {
					flag: attrs.flag,
					id : attrs.dataid,
					modelValue : c.$modelValue
				};
				for ( var item in param) {
					if (param[item] == null || param[item] === '') {
						delete param[item];
					}
				}
				requestService.post(url, param).then(function(data) {// success
					c.$setValidity('unique', data.data);
				}, function(data) {// error
					c.$setValidity('unique', false);
				});
			})
		}
	}
} ]);
app.directive('tenantUnique', ['requestService', function(requestService) {
	  return {
	    require: 'ngModel',
	    link: function(scope, ele, attrs, c) {
	      scope.$watch(attrs.ngModel, function() {
	    	  var url = '/security/hasTenantName';
	    	 var  para = {
						'tenantName': c.$modelValue
						};
			requestService.post(url, para).then(
					function(data){//success
						 c.$setValidity('unique', data.data);
					},
					function(data){//error
						 c.$setValidity('unique', false);
					});
	    })
	  }
	}}]);
app.directive('ensureUniqueTwo', ['requestService',
   function(requestService) {
   	return {
   		require : 'ngModel',
   		link : function(scope, ele, attrs, c) {
   			scope.$watch(attrs.ngModel, function() {
   				var url = attrs.url;
   				if (!url || !attrs.dataid || !c.$modelValue) {
   					return;
   				}
   				if (attrs.oldid == attrs.dataid && attrs.oldvalue == c.$modelValue) {
   					c.$setValidity('unique', true);
   					return;
   				}
   				var param = {
   					dataId : attrs.dataid,
   					modelValue : c.$modelValue
   				};
   				for ( var item in param) {
   					if (param[item] == null || param[item] === '') {
   						delete param[item];
   					}
   				}
   				requestService.post(url, param).then(function(data) {// success
   					c.$setValidity('unique', data.data);
   				}, function(data) {// error
   					c.$setValidity('unique', false);
   				});
   			})
   		}
   	}
} ]);