app.filter("dicFilter", [ 'cacheService', '$timeout',function(cacheService,$timeout) {
/**
 * dicType:字典类型id，或字典类型名称，名称需要在cacheService中配置
 */
	return function async(input, dicType) {
		var dics = cacheService.getDic(dicType,true);
		return dics && dics[input] || '';
	}
} ]);