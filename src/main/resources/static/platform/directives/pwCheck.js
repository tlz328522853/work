(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('pwCheckModule', []);

  module.directive('pwCheck', [function () {
     return {
         require: 'ngModel',
         link: function (scope, elem, attrs, ctrl) {
             var firstPassword = '#' + attrs.pwCheck;
             elem.add(firstPassword).on('keyup', function () {
                 scope.$apply(function () {
                     var v = elem.val()===$(firstPassword).val();
                     ctrl.$setValidity('pwmatch', v);
                 });
             });
         }
     }
 }]);

}).call(this);
