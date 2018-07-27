/**
 * 长字符串替换。。。。。显示
 * 分割字符
   取分割后第几个值
    
    
    {{value | cutIndex:true:length:' ....'}}
 */
app.filter('cutIndex', function () {
  return function (value, char, index) {
    if (!value) return '';
    var strs= new Array(); //定义一数组 
    strs=value.split(","); //字符分割 
    if(strs.length<=0||strs.length<=index){
    	return null;
    }
    return strs[index];
  };
});