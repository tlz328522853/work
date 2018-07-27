(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('topMenuModule', []);

  module.directive('topMenu', [
	function() {
      return {
        restrict: 'E',
        template: "<ul><li ng-repeat=\"menu in menuData track by $index\">"
        +"<style>a.{{menu.cls}} \
        {background:url(\"{{menu.icon_a}}\") center 10px no-repeat;\
            display: inline-block;\
            width:100%;\
						height: 65px;\
						border-right: 1px solid #79b6c4;\
						color: #474747;\
        }\
        a.{{menu.cls}}:hover \
        {background:#0987a2 url(\"{{menu.icon_b}}\") center 10px no-repeat;\
            display: inline-block;\
            cursor: pointer;\
						text-decoration: none;\
						color: #fff;\
        }\
        a.{{menu.cls}}.active \
        {background:#0987a2 url(\"{{menu.icon_b}}\") center 10px no-repeat;\
            display: inline-block;\
            cursor: pointer;\
						text-decoration: none;\
						color: #fff;\
        }\
        </style>"+"<a class=\"{{menu.cls}}\" ui-sref-active=\"active\" ui-sref=\"{{menu.url}}\"><p>{{menu.name}}</p></a></li></ul>",
        replace: true,
        scope: {
          menuData: '='
        },
		link: function(scope, element, attrs){
			
			menuData = [];
			
			scope.$watch("menuData",function(value,old){
				if(value && value.length > 0){
					angular.forEach(value,function(item){
						var pos = item.icon.lastIndexOf('.');
						item.cls = item.icon.substring(item.icon.lastIndexOf('/')+1,pos);
						item.icon_a = item.icon.substring(0,pos)+'_a'+item.icon.substring(pos);
						item.icon_b = item.icon.substring(0,pos)+'_b'+item.icon.substring(pos);
					});
				}				
			});
			
			scope.$on("$destroy",function (){
				menuData = null;
				element.remove();
			});
		}
      };
    }]
  );

}).call(this);