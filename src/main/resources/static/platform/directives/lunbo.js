(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('myLunboModule', []);

  module.directive('myLunbo', ['$compile', '$window', function($compile,$window) {
      return {
        restrict: 'EAMC',
        templateUrl:'platform/template/lunbo.html',
        replace: true,
        scope: {
        	slide: '=',
        	whichPic: '='
        },
        controller: function($scope){
        	$scope.$watch('slide',function(value){
        		if($scope.slide != null){
            		var newslide=$scope.slide.splice($scope.whichPic,1);
            		var e = {
            				image: newslide[0].image
            		}
            		$scope.slide.push(e);            		
            	}
        	});
        },
        link: function(scope, element, attrs){        	
			function getStyle(obj, attr) {
				if (obj.currentStyle) {
					return obj.currentStyle[attr];
				} else {
					return window.getComputedStyle(obj, false)[attr];
				}
			}

			function startMove(obj, json, fn) {				
				clearInterval(obj.timer);
				obj.timer = setInterval(function() {
					for (attr in json) {
						//获取当前属性值
						if (attr == 'opacity') {
							var iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
						} else {
							var iCur = parseInt(getStyle(obj, attr));
						}
						//计算速度
						var iSpeed = (json[attr] - iCur) / 8;
						iSpeed > 0 ? iSpeed = Math.ceil(iSpeed) : iSpeed = Math.floor(iSpeed);

						//判断停止
						if (iCur == json[attr]) {
							clearInterval(obj.timer);
							if (fn) {
								fn();
							}
						} else {
							if (attr == 'opacity') {
								obj.style.filter = 'alpha(opacity:' + parseInt(iCur + iSpeed) + ')';
								obj.style.opacity = (iCur + iSpeed) / 100;
							} else {
								obj.style[attr] = (iCur + iSpeed) + 'px';
							}
						}
					}
				}, 30);
			};
			var btnPrev = document.getElementById("btn_prev"); //左按钮
			var btnNext = document.getElementById("btn_next"); //右按钮
			
			var markLeft = document.getElementById("mark_left"); //左区域
			var markRight = document.getElementById("mark_right"); //右区域
			var bigLis = document.getElementById("big_pic").getElementsByTagName("li");
			
			var currentImgIndex = 0;
			var maxZindex = 1;
			btnPrev.onmouseover=markLeft.onmouseover=function(){
				startMove(btnPrev,{opacity:100});
			};
			btnPrev.onmouseout=markLeft.onmouseout=function(){
				startMove(btnPrev,{opacity:0});
			};
			btnNext.onmouseover=markRight.onmouseover = function(){
				startMove(btnNext,{opacity:100});
			};
			btnNext.onmouseout=markRight.onmouseout = function(){
				startMove(btnNext,{opacity:0});
			};
			var f=true;
			btnPrev.onclick = function(){
				currentImgIndex--;
				if(currentImgIndex < 0) {
					currentImgIndex = bigLis.length-1;
				}
				if(f){
					currentImgIndex = 0;
					f=false;
				}
				//切换图片
				tabImg();
			};
			var flag=true;
			btnNext.onclick = function(){
				currentImgIndex++;
				if(currentImgIndex > (bigLis.length-1)) {
					currentImgIndex = 0;
				}
				if(bigLis.length==2 && flag){
					currentImgIndex=0;
					flag=false;
				}
				//切换图片
				tabImg();
			};
			function tabImg(){
				bigLis[currentImgIndex].style["z-index"] = ++maxZindex;
			}
		}
      };
    }
  ]);

}).call(this);
