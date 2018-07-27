angular.module('platform');
angular.module('recovery', ['platform'])
.config(['$stateProvider', '$urlRouterProvider','$ocLazyLoadProvider',
            function ($stateProvider, $urlRouterProvider,$ocLazyLoadProvider) {
    
    //////////////////////////
    // State Configurations //
    /////////////////////////

    // Use $stateProvider to configure your states.
	$stateProvider	   

	.state("home.sideMenu.userSuggestCodeDateRp", {
		url: "/userSuggestCodeDateRp",//用户邀请码日报表
		templateUrl: 'platform/template/report.html',
		resolve: {
			loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('recovery/controllers/util/reportRecoveryController.js');
			}]
		},
		controller:'reportRecoveryController'
	})
	
    }
]);