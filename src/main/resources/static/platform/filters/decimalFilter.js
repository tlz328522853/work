/**
 * 强制保留小数点
 * 默认是两位小数点
 *   {{value | decimal:length}}
 */
app.filter('decimal', function () {
  return function (x,length) {
	  if(length==null||length==''){
		  length=2;
	  }
	  var f = parseFloat(x);    
      if (isNaN(f)) {    
          return "";    
      }    
     
      var values=x.toString().split(".");
      if(values.length>1&&values[1]!=''){
    	 var c=parseFloat(values[0]+"."+values[1].substr(0,length))
    	  return c;  
      }else if(x.toString().indexOf('.')>0){
    	  return values[0]+"."
      }else{
    	  return x;
      }
      /*var rs = s.indexOf('.');    
      if (rs < 0) {    
          rs = s.length;    
          s += '.';    
      }  */  
     /* while (s.length <= rs + length) {    
          s += '0';    
      }*/
      var value=parseFloat(s)
      
  };
});