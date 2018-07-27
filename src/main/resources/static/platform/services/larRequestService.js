app.service('larRequestService', ['$http','notifications', '$rootScope', '$state', 'ngLoadingService', '$cookieStore','$q',
    function ($http,notifications, $rootScope, $state, ngLoadingService, $cookieStore,$q) {
    larUrls = {'/lar': 'http://localhost:8080'};
//	 larUrls = {'/lar': 'http://192.168.2.224:58085'};//测试环境
    var postRequest = function (path, data, isLoading) {
        var token = null;
       /* if (isLoading != undefined && isLoading == true)
            ngLoadingService.setNgLoading(true);*/

        if ($rootScope.user != null) {
            token = $rootScope.user.token;
        }
        if (token == null) {
            token = $cookieStore.get("token");
        }
        if(data == null){
            data = {};
        }
        //data.token=$rootScope.token;
//        url = larUrls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
       var url=getUrl(path)+"?app=web";
        return $http({
            url: url,
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'token': token,
                'app': 'web'
            },
        }).success(function (data, header, config, status) {

            if (data.code != null && (data.code == 10401 || data.code == 10405 || data.code == 10406)) {
                if (data.code == 10405) {
                    var boolean = $cookieStore.get("10405");
                    if (boolean == null || !boolean) {
                        alert("长时间没有操作,登入已经过期！");
                        $cookieStore.put("10405", true);
                    }
                }
                if (data.code == 10406) {
                    var boolean = $cookieStore.get("10406");
                    if (boolean == null || !boolean) {
                        alert("用户异地登入,你已被强制下线！");
                        $cookieStore.put("10406", true);
                    }
                }
                if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
                    $rootScope.ngDialog.close(true)
                }
                $state.go('login');
            } else if (data.code != null && data.code == 10403) {
                notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
            } else if (status != null && status == 10401) {
                $state.go('login')
            }
            ngLoadingService.setNgLoading(false);
            return data;
        }).error(function (data, header, config, status) {
            //处理响应失败
            ngLoadingService.setNgLoading(false);
            return data;
        });
    }
    var getRequest = function (path, data, isLoading) {
        var token = null;
        /*if (isLoading != undefined && isLoading == true)
            ngLoadingService.setNgLoading(true);*/

        if ($rootScope.user != null) {
            token = $rootScope.user.token;
        }
        if (token == null) {
            token = $cookieStore.get("token");
        }
        if(data == null){
            data = {};
        }
        var url=getUrl(path)+"?app=web";
        return $http({
            url: url,
            method: 'GET',
            data: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'token': token,
                'app': 'web'
            },
        }).success(function (data, header, config, status) {
            if (data.code != null && (data.code == 10401 || data.code == 10405 || data.code == 10406)) {
                if (data.code == 10405) {
                    var boolean = $cookieStore.get("10405");
                    if (boolean == null || !boolean) {
                        alert("长时间没有操作,登入已经过期！");
                        $cookieStore.put("10405", true);
                    }
                }
                if (data.code == 10406) {
                    var boolean = $cookieStore.get("10406");
                    if (boolean == null || !boolean) {
                        alert("用户异地登入,你已被强制下线！");
                        $cookieStore.put("10406", true);
                    }
                }
                if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
                    $rootScope.ngDialog.close(true)
                }
                $state.go('login');
            } else if (data.code != null && data.code == 10403) {
                notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
            } else if (status != null && status == 10401) {
                $state.go('login')
            }
            ngLoadingService.setNgLoading(false);
            return data;
        }).error(function (data, header, config, status) {
            //处理响应失败
            ngLoadingService.setNgLoading(false);
            return data;
        });
    }
    var getUrl = function (path) {
    	var url=larUrls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
    	url=path;
        return url;
    }
    var downloadRequest = function(path, data, fileName){
        var token = null;
        /*if (isLoading != undefined && isLoading == true)
         ngLoadingService.setNgLoading(true);*/

        if ($rootScope.user != null) {
            token = $rootScope.user.token;
        }
        if (token == null) {
            token = $cookieStore.get("token");
        }
        if(data == null){
            data = {};
        }
        var url=getUrl(path)+"?app=web";
        //url =path;
        var deferred = $q.defer();
        $http({
            url: url,
            method: 'POST',
            data: JSON.stringify(data),
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                //'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'token': token,
                'app': 'web'
            }
        }).success(function(data){
            var blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(blob, fileName);
        }).error(function(){
                console.log("downloadRequest error...")
            })
            .then(function(response) {
                ngLoadingService.setNgLoading(false);
                if(response.data.code != null && (response.data.code==10401||response.data.code==10405||response.data.code==10406)){

                    if(response.data.code==10405){
                        var boolean=$cookieStore.get("10405");
                        if(boolean==null||!boolean){
                            alert("长时间没有操作,登入已经过期！");
                            $cookieStore.put("10405",true);
                        }

                    }
                    if(response.data.code==10406){
                        var boolean=$cookieStore.get("10406");
                        if(boolean==null||!boolean){
                            alert("用户异地登入,你已被强制下线！");
                            $cookieStore.put("10406",true);
                        }

                    }
                    if($rootScope.ngDialog!=null&&$rootScope.ngDialog.close!=null){
                        $rootScope.ngDialog.close(true)
                    }
                    $state.go('login');
                } else if (response.data.code != null && response.data.code == 10403) {
                    notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
                }else if(response.data.code == 10202){
                    deferred.resolve(response.data);
                }else if(response.data.code != null && response.data.code != 200){
                    // 凡是后台返回ResultDTO.getFailure
                    // 前端页面提示，后台传过来的错误消息message
                    notifications.showError(response.data.message);
                    deferred.reject(response.data);
                } else {
                    deferred.resolve(response.data);
                }

            }, function(response) {
                ngLoadingService.setNgLoading(false);
                // 前端页面提示
                notifications.showError("操作失败");
                deferred.reject(response);

            });
        return deferred.promise;
    }
    saveAs = function(blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
    }

    return {
        post: postRequest,
        get: getRequest,
        getUrl: getUrl,
        download:downloadRequest
    };
}]);

//传递日期的格式化，返回字符串
function dateFormat(date,fmt)
{
	if(!date){
		date=new Date();
	}
	if(!fmt){
		fmt="yyyy-MM-dd hh:mm:ss";
	}
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

//传递日期的下一天格式化，返回字符串
function nextDateFormat(date,fmt)
{   var curDate=new Date(date.getTime());
	var now=new Date(curDate.setDate(curDate.getDate()+1));
	return dateFormat(now,fmt);
}
