app.service('requestService',
['$http', '$rootScope', '$state', '$cookieStore', '$window', '$q', 'ngLoadingService', 'notifications',
	function ($http, $rootScope, $state, $cookieStore, $window, $q, ngLoadingService, notifications) {
		$rootScope.ngDialog = {};
		urls = {
			'/security' : 'http://localhost:8080',
			'/advert':'http://localhost:8282',
			'/lar' : 'http://localhost:8080', //测试环境
			'/envsanitation' : 'http://localhost:8181'
		};
		var clearCache = function () {
			$cookieStore.remove("tenantId");
			$cookieStore.remove("tenantName");
			$cookieStore.remove("isRoot");
			$cookieStore.remove("groupId");
			$cookieStore.remove("userId");
			$cookieStore.remove("employeeId");
			$cookieStore.remove("employeeName");
			$cookieStore.remove("token");
			$cookieStore.remove("name");
			$cookieStore.remove("orgId");
			$cookieStore.remove("orgName");
			$cookieStore.remove("roleType");
			$cookieStore.remove("roles");
		};
		var downloadRequest = function (path, data, fileName, suffix,type) {
//			if(isLoading != undefined && isLoading == true)
			ngLoadingService.setNgLoading(true);
			if ($rootScope.user != null) {
				data.token = $rootScope.user.token;
			}
			if (data.token == null) {
				data.token = $cookieStore.get("token");
			}
			if (data.app == null) {
				data.app = "web";
			}
			url = urls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
//			url = path+"?token="+$cookieStore.get("token")+"&app=web";
			var deferred = $q.defer();
			$http({
				url : url,
				method : 'POST',
				responseType : 'arraybuffer',
				/*data:{
				'token': data.token
				},*/
				data : data,
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
					'Accept' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				},
				transformRequest : function (obj) {
					return $.param(obj);
				}
			}).success(function (data) {
				var blob = new Blob([data], {
						type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					});
				if(type=="zip"){
					blob = new Blob([data], {
						type : 'application/x-zip-compressed'
					});
				}
				//saveAs(blob, fileName + '.xlsx');
				saveAs(blob, fileName, suffix);
			}).error(function (obj) {
				console.log("downloadRequest error...")
			})
			.then(function (response) {
				ngLoadingService.setNgLoading(false);
				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {

					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}

					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
							alert("用户异地登入,你已被强制下线！");
							$cookieStore.put("10406", true);
						}

					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError(response.data.message);
				} else if (response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 凡是后台返回ResultDTO.getFailure
					// 前端页面提示，后台传过来的错误消息message
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}

			}, function (response) {
				ngLoadingService.setNgLoading(false);
				// 前端页面提示
				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {

					if (response.status == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}

					}
					if (response.status == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
							alert("用户异地登入,你已被强制下线！");
							$cookieStore.put("10406", true);
						}

					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.status != null && response.status == 10403) {
					if (response.data && response.data.message) {
						notifications.showError(response.data.message);
					} else {
						notifications.showError("无请求权限");
					}
				}else {
					deferred.resolve(response.data);
				}

				deferred.reject(response);

			});
			return deferred.promise;
		};

		var saveAs = function (blob, fileName, suffix) {
			if (window.navigator.msSaveOrOpenBlob) {
				if (fileName != null && suffix) {
					fileName = fileName + suffix;
				}
				navigator.msSaveBlob(blob, fileName);
			} else if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
				//兼容火狐
				var link = document.createElement('a');
				link.setAttribute("href",window.URL.createObjectURL(blob));
				//link.appendChild(document.createTextNode(fileName));  
				link.setAttribute("download",fileName);
				document.getElementsByTagName("BODY")[0].appendChild(link); 
				link.click();
				window.URL.revokeObjectURL(link.href);
			}else {
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = fileName;
				link.click();
				window.URL.revokeObjectURL(link.href);
			}
		};

		//isLoading - set loading image when waiting for a response, default is false,
		var postRequest = function (path, data, isLoading) {

			/*if(isLoading != undefined && isLoading == true)
			ngLoadingService.setNgLoading(true);*/

			if ($rootScope.user != null) {
				data.token = $rootScope.user.token;
			}
			if (data.token == null) {
				data.token = $cookieStore.get("token");
			}
			if (data.app == null) {
				data.app = "web";
			}
			url = urls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
//			url = path;
			var deferred = $q.defer();
			$http({
				method : 'POST',
				url : url,
				data : data,
				async : true,
				xhrFields : {
					withCredentials : false,
					useDefaultXhrHeader : false
				},
				headers : {
					'Accept' : 'application/json',
					'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest : function (obj) {
					return $.param(obj);
				}
			}).then(function (response) {
				ngLoadingService.setNgLoading(false);
				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {
					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}

					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
							alert("用户异地登入,你已被强制下线！");
							$cookieStore.put("10406", true);
						}

					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError(response.data.message);
				} else if (response.data.code != null && response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 前端页面提示，后台传过来的错误消息message
					// 凡是后台返回ResultDTO.getFailure
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}

			}, function (response) {
				ngLoadingService.setNgLoading(false);
				// 前端页面提示
				notifications.showError("操作失败");
				deferred.reject(response);

			});
			return deferred.promise;

		};

		var setNgDialog = function (ngDialog) {
			$rootScope.ngDialog = ngDialog;
		};
		var getRequest = function (path, data) {
			return $http({
				method : 'GET',
				url : host + path,
				data : data,
				headers : {
					'Accept' : 'application/json',
					'Content-Type' : 'application/json'
				},
				transformRequest : function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				}
			}).then(function (response) {
				ngLoadingService.setNgLoading(false);
				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {
					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}

					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
							alert("用户异地登入,你已被强制下线！");
							$cookieStore.put("10406", true);
						}

					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError(response.data.message);
				} else if (response.data.code != null && response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 凡是后台返回ResultDTO.getFailure
					// 前端页面提示，后台传过来的错误消息message
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}
				return response.data;

			}, function (response) {
				return response;

			});
		};

		var uploadRequest = function (path, data, isLoading) {

			/*if(isLoading != undefined && isLoading == true)
			ngLoadingService.setNgLoading(true);*/
			if ($rootScope.user != null) {
				data.token = $rootScope.user.token;
			}
			if (data.token == null) {
				data.token = $cookieStore.get("token");
			}
			if (data.app == null) {
				data.app = "web";
			}
			url = urls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
//			url = path;
			url = url + "?token=" + data.token+"&&app=web";
			var deferred = $q.defer();
			$http({
				method : 'POST',
				url : url,
				data : data,
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			}).then(function (response) {
				ngLoadingService.setNgLoading(false);
				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {
					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}

					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
							alert("用户异地登入,你已被强制下线！");
							$cookieStore.put("10406", true);
						}

					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError(response.data.message);
				} else if (response.data.code != null && response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code == 10602) {
					deferred.reject(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 前端页面提示，后台传过来的错误消息message
					// 凡是后台返回ResultDTO.getFailure
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}

			}, function (response) {
				ngLoadingService.setNgLoading(false);
				// 前端页面提示
				notifications.showError("操作失败");
				deferred.reject(response);

			});
			return deferred.promise;
		};
		
		var getRequestForBaidu = function (path) {
			return $http({
				method : 'JSONP',
				url : path,
				headers : {
					'Accept' : 'application/json',
					'Content-Type' : 'application/json'
				},
			}).then(function (response) {
				return response;

			}, function (response) {
				return response;

			});
		};
		
		
		return {
			post : postRequest,
			get : getRequest,
			setNgDialog : setNgDialog,
			download : downloadRequest,
			upload : uploadRequest,
			getForBaidu : getRequestForBaidu
		};

	}
]);