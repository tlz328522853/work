(function() {
	var module,
		__indexOf = [].indexOf || function(item) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && this[i] === item) return i;
			}
			return -1;
		};

	module = angular.module('treeShrinkModule', []);

	module.directive('treeShrink', ['$compile', '$window', function($compile, $window) {
		return {
			restrict: 'A',
			/*template:
						'<div class="tree_shrink" id="tree_shrink"></div>'+
						'<div class="tree_an" id="tree_an"></div></div>',*/
			replace: true,
			scope: {
				
			},
			link: function(scope, element, attrs) {
				
				element.append('<div class="tree_shrink"></div>');
				element.append('<div class="tree_an"></div>'); 
				var tree_shrink = $(".tree_shrink");
				var tree_an = $(".tree_an");
				var indexright_cont_conl = $(".indexright_cont_conl");
				var indexright_cont_con = $(".indexright_cont_con");
				showSidePanel = function() {
					$('.indexright_cont_conl').animate({
						left: '0px'
					});
					$('.tree_shrink').animate({
						left: '173px'
					});
					$('.tree_an').animate({
						left: '200px'
					});
					setTimeout(function() {
						$(".tree_shrink").show();
						$(".tree_an").hide();
					}, 10);
				}
				
				hideSidePanel = function() {
					$('.indexright_cont_conl').animate({
						left: '-200px'
					});
					$('.tree_shrink').animate({
						left: '200px'
					});
					$('.tree_an').animate({
						left: '200px'
					});

					setTimeout(function() {
						$(".tree_an").show();
						$(".tree_shrink").hide();
					}, 10);
				}
				$(".tree_shrink").on("click", function(e) {
					hideSidePanel();
					e.preventDefault();
					$(".indexright_cont_con").removeAttr("id");
					$(".indexright_cont_con").attr("id","indexright_cont_table");
				});
				$(".tree_an").on("click", function(e) {
					showSidePanel();
					e.preventDefault();
					 $(".indexright_cont_con").attr("id","indexright_cont_con");
				});
				showSidePanel();
			}
		};
	}]);

}).call(this);