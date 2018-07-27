'use strict';

angular.module('pbComponents', [])
    /**
     * @ngdoc directive
     * @name ngTreeBtn
     *
     * @description
     * The 'ngTreeBtn' directive instantiates a template with the multi-select drop-down.
     * Drop-down is marked up as a Bootstrap button with a caret.
     * Checked state of options is kept in local object checkMarks
     *
     * @element - any
     * @param ng-tree-btn - data object with dropdown options tree;
     *     each leaf of the tree is selectable and has to have an "id" property.
     * @param label - the text on the button
     * @param btnCls - additional style class(es) for the button
     * @param callback - function which takes selection results as object with
     *     property names as tree leaves' ids and values as boolean "checked" status
     *     example of result argument passed to callback: {"123":true,"763":false,"2":true}
     * @param enabled - function used to determine enabled/disabled state
     *
     * @author pbosin
     */
    .directive('ngTreeBtn', function () {
        return {
            scope: {
                options: '=ngTreeBtn',
                handleRes: '&callback',
                label: '@',
                isEnabled: '&'
            },
            controller: function($scope, $attrs) {

                $scope.btnCls = $attrs.btncls;

                $scope.hasChildren = function (item) {
                    return (typeof(item.children) !== "undefined" && item.children.length > 0);
                };

                $scope.toggleDrop = function () {
                    if ($scope.isEnabled()) {
                        $scope.opened = !$scope.opened;
                    }
                };

                function isChecked (obj) {
                    var i;
                    if (!obj || typeof(obj) === "undefined") {
                        return false;
                    }
                    if (typeof(obj.children) === "undefined" || obj.children.length == 0) {
                        //tree leaf
                        return typeof(obj.id) !== "undefined" && checkMarks[obj.id];
                    } else {
                        //traverse children
                        for (i in obj.children) {
                            if (! isChecked(obj.children[i])) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                $scope.checked = function (item) {
                    return isChecked(item);
                };

                function setItemCheck (obj, newState) {
                    var i;
                    if ($scope.hasChildren(obj)) {
                        for (i in obj.children) {
                            setItemCheck(obj.children[i], newState);
                        }
                    } else {
                        checkMarks[obj.id] = newState;
                    }
                }
                $scope.selectItem = function (obj) {
                    var newState = !isChecked(obj);
                    setItemCheck(obj, newState);
                    return false;
                };

                function saveResult(obj, result) {
                    var i;
                    if ($scope.hasChildren(obj)) {
                        for (i in obj.children) {
                            saveResult(obj.children[i], result);
                        }
                    } else {
                        result["" + obj.id] = checkMarks[obj.id];
                    }
                }
                $scope.confirmMulti = function () {
                    var result = {};
                    saveResult($scope.options,result);
                    $scope.toggleDrop();
                    $scope.handleRes({res:result});
                };

                function addChk(chks, item) {
                    var i;
                    if (typeof(item) !== "undefined" && $scope.hasChildren(item)) {
                        for (i in item.children) {
                            addChk(chks,item.children[i]);
                        }
                    } else {
                        chks[item.id] = (typeof(item.checked) !== "undefined" && item.checked);
                    }
                }
                function initChks(children) {
                    var chks = {}, i;
                    if (typeof(children) !== "undefined") {
                        for (i in children) {
                            addChk(chks,children[i]);
                        }
                    }
                    return chks;
                }
                var checkMarks = initChks($scope.options.children);
            },
            template:'<div class="btn-group">'+
'  <button class="btn {{btnCls}} dropdown-toggle btna" ng-class="{disabled: !isEnabled()}"'+
'          ng-click="toggleDrop()">{{label}} <b class="caret"></b>'+
'  </button>'+
'  <ul class="dropdown-menu block" ng-show="opened">'+
'    <li>'+
'      <a class="multiAll" href="#" ng-click="selectItem(options)">所有 '+
'        <span class="icon-ok" ng-show="checked(options)"></span>'+
'      </a>'+
'      <ul class="menu">'+
'        <li ng-repeat="item in options.children">'+
'          <a ng-show="!hasChildren(item)"'+
'             class="multicheck" href="#" ng-click="selectItem(item)">{{item.label}}'+
'            <span class="icon-ok" ng-show="checked(item)"></span>'+
'          </a>'+
'          <a ng-show="hasChildren(item)" class="multiAll" href="#"'+
'             ng-click="selectItem(item)">{{item.label}}'+
'            <span class="icon-ok" ng-show="checked(item)"></span>'+
'          </a>'+
'          <ul ng-show="hasChildren(item)" class="menu">'+
'            <li ng-repeat="option in item.children">'+
'              <a class="multicheck" href="#" ng-click="selectItem(option)">{{option.label}}'+
'                <span class="icon-ok" ng-show="checked(option)"></span>'+
'              </a>'+
'            </li>'+
'          </ul>'+
'        </li>'+
'      </ul>'+
'    </li>'+
'    <li class="centered">'+
'      <button class="btn btn-mini btn-info saveMultiAll" ng-click="confirmMulti($event)">确定</button>'+
'    </li>'+
'    <div class="clearfix"></div>'+
'  </ul>'+
'</div>'
			}
    })

