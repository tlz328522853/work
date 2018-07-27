app.filter("unitFilter", function() {
	return function(input, key) {
		var result = 0;
		if(input != null && input != 0 && key){
			result = input.toString() + key;
		}
		return result;
	}
});