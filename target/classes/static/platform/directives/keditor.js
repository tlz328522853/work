module = angular.module('keditor', [])
module.directive('keditor', function () {

    var linkFn = function (scope, elm, attr, ctrl) {

        var _config = {
    		width: '100%',
            height: '400px',
        	uploadJson : '/lar/jsp/upload_json.jsp',
        	fileManagerJson : 'platform/libs/kindeditor/jsp/file_manager_json.jsp',
        	filterMode : false,
        	autoHeightMode: false,
            formatUploadUrl: false,
            allowFileManager: true,
            
            afterChange: function () {
                if (!scope.$$phase) {
	                ctrl.$setViewValue(this.html());
	                // exception happens here when angular is 1.2.28
	                // scope.$apply();
	            }
            },
            afterBlur: function(){
            	this.sync();
            },
            afterCreate: function () {
                this.loadPlugin('autoheight');
            },
        	afterCreate : function() {
        		this.sync();
        	},
        	afterBlur : function() {
        		this.sync();
        	}
        };
        
        var editor;
        var editorId = elm[0],
            editorConfig = scope.config || _config;

        if (KindEditor) {
        	editor = KindEditor.create(editorId, editorConfig);
        }
        var content = ctrl.$viewValue;
        ctrl.$render = function () {
        	content = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
            editor.html(content);
        };
        if(scope.setHtml != undefined){
        	editor.html(scope.setHtml);
        }

        // 每次更改文本框的值都会执行$parsers里面的函数,并把新值传递过来
        // $parsers:也就是从viewValue向modelValue绑定的过程处理函数
        ctrl.$parsers.push(function (viewValue) {
        	ctrl.$setValidity('keditor', viewValue);
            return viewValue;
        });

    };

    return {
    	restrict: 'EA',
        require: '?ngModel',
        scope: {
        	setHtml: '=',
        	config: '=config' 
        },
        link: linkFn
    };
    
});