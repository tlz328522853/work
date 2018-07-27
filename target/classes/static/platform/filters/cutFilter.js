/**
 * 长字符串替换。。。。。显示
 * 替换方式 (布尔) - 如果是 true，只切单个字。
   长度 (整数) - 要保留的最大字數。
    后缀 (字串，默认：'…') -替换的字符。
    
    {{value | cut:true:length:' ....'}}
 */
app.filter('cut', function () {
  return function (value, wordwise, max, tail) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length == undefined){
    	value=value+'';
    }
    if (value.length <= max) return value;
    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(' ');
      if (lastspace != -1) {
        value = value.substr(0, lastspace);
      }
    }
    return ""+value + (tail || ' …')+"";
  };
});