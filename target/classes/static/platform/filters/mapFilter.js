app.filter("mapFilter", function() {

	return function(input, keys, values) {
		if(keys && values){
			var keySet = keys.split(',');
			var valueSet = values.split(',');
			if(input == null) result = valueSet[keySet[0]];
			else result = valueSet[keySet.indexOf(input.toString())];
		}else{
			if(input === 1 || input === '1' || input === true || input === 'true'){
				result = '是';
			}
			else{
				result = '否';
			}
		}

		return result;
	}
});