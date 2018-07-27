angular.module('ivh.treeview', []);
angular.module('ivh.treeview').constant('ivhTreeviewInterpolateEndSymbol', '}}');
angular.module('ivh.treeview').constant('ivhTreeviewInterpolateStartSymbol', '{{');
angular.module('ivh.treeview').directive('ivhTreeviewCheckboxHelper', [function() {'use strict';
  return {
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewCheckboxHelper',
      
    },
    require: '^ivhTreeview',
    link: function(scope, element, attrs, trvw) {
      var node = scope.node,opts = trvw.opts(),indeterminateAttr = opts.indeterminateAttribute,selectedAttr = opts.selectedAttribute;
      scope.isSelected = node[selectedAttr];
      scope.trvw = trvw;
      scope.resolveIndeterminateClick = function() {
        if(node[indeterminateAttr]) {
          trvw.select(node, true);
        }
      };
      scope.$watch('node.' + selectedAttr, function(newVal, oldVal) {
        scope.isSelected = newVal;
      });
      scope.$watch('node.' + indeterminateAttr, function(newVal, oldVal) {
        element.find('input').prop('indeterminate', newVal);
      });
    },
    template: [
      '<input type="checkbox"',
        'class="ivh-treeview-checkbox"',
        'ng-model="isSelected"',
        'ng-click="resolveIndeterminateClick()"',
        'ng-change="trvw.select(node, isSelected)" />'
    ].join('\n')
  };
}]);
angular.module('ivh.treeview').directive('ivhTreeviewCheckbox', [function() {'use strict';
  return {
    restrict: 'AE',
    require: '^ivhTreeview',
    template: '<span ivh-treeview-checkbox-helper="node"></span>'
  };
}]);
angular.module('ivh.treeview').directive('ivhTreeviewChildren', function() {'use strict';
  return {
    restrict: 'AE',
    require: '^ivhTreeviewNode',
    template: [
      '<ul ng-if="getChildren().length" class="ivh-treeview">',
        '<li ng-repeat="child in getChildren()"',
            'ng-hide="trvw.hasFilter() && !trvw.isVisible(child)"',
            'class="ivh-treeview-node"',
            'ng-class="{\'ivh-treeview-node-collapsed\': !trvw.isExpanded(child) && !trvw.isLeaf(child)}"',
            'ivh-treeview-node="child"',
            'ivh-treeview-depth="childDepth">',
        '</li>',
      '</ul>'
    ].join('\n')
  };
});
angular.module('ivh.treeview').directive('ivhTreeviewNode', ['ivhTreeviewCompiler', function(ivhTreeviewCompiler) {'use strict';
  return {
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewNode',
      depth: '=ivhTreeviewDepth'
    },
    require: '^ivhTreeview',
    compile: function(tElement) {
      return ivhTreeviewCompiler
        .compile(tElement, function(scope, element, attrs, trvw) {
          var node = scope.node;
          var getChildren = scope.getChildren = function() {
            return trvw.children(node);
          };
          scope.trvw = trvw;
          scope.childDepth = scope.depth + 1;
          if(!trvw.isExpanded(node)) {
            trvw.expand(node, trvw.isInitiallyExpanded(scope.depth));
          }
          scope.$watch(function() {
            return getChildren().length > 0;
          }, function(newVal) {
            if(newVal) {
              element.removeClass('ivh-treeview-node-leaf');
            } else {
              element.addClass('ivh-treeview-node-leaf');
            }
          });
        });
    }
  };
}]);
angular.module('ivh.treeview').directive('ivhTreeviewToggle', [function() {'use strict';
  return {
    restrict: 'A',
    require: '^ivhTreeview',
    link: function(scope, element, attrs, trvw) {
      var node = scope.node;
      element.addClass('ivh-treeview-toggle');
      element.bind('click', function() {
        if(!trvw.isLeaf(node)) {
          scope.$apply(function() {
            trvw.toggleExpanded(node);
            trvw.onToggle(node);
          });
        }
      });
    }
  };
}]);
angular.module('ivh.treeview').directive('ivhTreeviewTwistie', ['$compile', 'ivhTreeviewOptions', function($compile, ivhTreeviewOptions) {'use strict';
  var globalOpts = ivhTreeviewOptions();
  return {
    restrict: 'A',
    require: '^ivhTreeview',
    template: [
      '<span class="ivh-treeview-twistie">',
        '<span class="glyphicon glyphicon-plus ivh-treeview-twistie-collapsed"></span>',
        '<span class="glyphicon glyphicon-minus ivh-treeview-twistie-expanded"></span>',
        '<span class="glyphicon glyphicon-minus ivh-treeview-twistie-leaf"></span>',
      '</span>'
    ].join('\n'),
    link: function(scope, element, attrs, trvw) {
      if(!trvw.hasLocalTwistieTpls) {return;}
      var opts = trvw.opts(),$twistieContainers = element.children().eq(0).children();
      angular.forEach([], function(tplKey, ix) {
        var tpl = opts[tplKey],tplGlobal = globalOpts[tplKey];
        if(!tpl || tpl === tplGlobal) {return;}
        if(tpl.substr(0, 1) !== '<' || tpl.substr(-1, 1) !== '>') {
          tpl = '<span>' + tpl + '</span>';
        }
        var $el = $compile(tpl)(scope),$container = $twistieContainers.eq(ix);
        $container.html('').append($el);
      });
    }
  };
}]);
angular.module('ivh.treeview').directive('ivhTreeview', ['ivhTreeviewMgr', 
   function(ivhTreeviewMgr) {'use strict';
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      root: '=ivhTreeview',
      childrenAttribute: '=ivhTreeviewChildrenAttribute',
      defaultSelectedState: '=ivhTreeviewDefaultSelectedState',
      expandToDepth: '=ivhTreeviewExpandToDepth',
      idAttribute: '=ivhTreeviewIdAttribute',
      indeterminateAttribute: '=ivhTreeviewIndeterminateAttribute',
      expandedAttribute: '=ivhTreeviewExpandedAttribute',
      labelAttribute: '=ivhTreeviewLabelAttribute',
      nodeTpl: '=ivhTreeviewNodeTpl',
      selectedAttribute: '=ivhTreeviewSelectedAttribute',
      onCbChange: '&ivhTreeviewOnCbChange',
      onToggle: '&ivhTreeviewOnToggle',
      useCheckboxes: '=ivhTreeviewUseCheckboxes',
      validate: '=ivhTreeviewValidate',
      visibleAttribute: '=ivhTreeviewVisibleAttribute',
      userOptions: '=ivhTreeviewOptions',
      filter: '=ivhTreeviewFilter',
      toCompany:'=',
      title:'=',
      ngSettings:'='
    },
    controllerAs: 'trvw',
    controller: ['$scope', '$element', '$attrs', '$transclude', 'ivhTreeviewOptions', 'filterFilter', 
                 function($scope, $element, $attrs, $transclude, ivhTreeviewOptions, filterFilter) {
      var ng = angular,trvw = this;
      var localOpts = ng.extend({}, ivhTreeviewOptions(), $scope.userOptions);
      ng.forEach([
        'childrenAttribute',
        'defaultSelectedState',
        'expandToDepth',
        'idAttribute',
        'indeterminateAttribute',
        'expandedAttribute',
        'labelAttribute',
        'nodeTpl',
        'selectedAttribute',
        'useCheckboxes',
        'validate',
        'visibleAttribute'
      ], function(attr) {
        if(ng.isDefined($scope[attr])) {
          localOpts[attr] = $scope[attr];
        }
      });
      var normedAttr = function(attrKey) {
        return 'ivhTreeview' +
          attrKey.charAt(0).toUpperCase() +
          attrKey.slice(1);
      };
      ng.forEach(['onCbChange','onToggle'], function(attr) {
        if($attrs[normedAttr(attr)]) {
          localOpts[attr] = $scope[attr];
        }
      });
      trvw.opts = function() {
        return localOpts;
      };
      var userOpts = $scope.userOptions || {};
      trvw.children = function(node) {
        var children = node[localOpts.childrenAttribute];
        return ng.isArray(children) ? children : [];
      };
      trvw.label = function(node) {
        return node[localOpts.labelAttribute];
      };
      trvw.id = function(node) {
          return node[localOpts.idAttribute];
        };
      trvw.hasFilter = function() {
        return ng.isDefined($scope.filter);
      };
      trvw.getFilter = function() {
        return $scope.filter || '';
      };
      trvw.isVisible = function(node) {
        var filter = trvw.getFilter();
        if(!filter || filterFilter([node], filter).length) {
          return true;
        }
        if(typeof filter === 'object' || typeof filter === 'function') {
          var children = trvw.children(node);
          for(var ix = children.length; ix--;) {
            if(trvw.isVisible(children[ix])) {
              return true;
            }
          }
        }
        return false;
      };
      trvw.useCheckboxes = function() {
        return localOpts.useCheckboxes;
      };
      trvw.select = function(node, isSelected) {
        ivhTreeviewMgr.select($scope.root, node, localOpts, isSelected);
        trvw.onCbChange(node, isSelected);
      };
      trvw.isSelected = function(node) {
        return node[localOpts.selectedAttribute];
      };
      trvw.toggleSelected = function(node) {
        var isSelected = !node[localOpts.selectedAttribute];
        trvw.select(node, isSelected);
      };
      trvw.expand = function(node, isExpanded) {
        ivhTreeviewMgr.expand($scope.root, node, localOpts, isExpanded);
      };
      trvw.isExpanded = function(node) {
        return node[localOpts.expandedAttribute];
      };
      trvw.toggleExpanded = function(node) {
        trvw.expand(node, !trvw.isExpanded(node));
      };
      trvw.isInitiallyExpanded = function(depth) {
        var expandTo = localOpts.expandToDepth === -1 ?
          Infinity : localOpts.expandToDepth;
        return depth < expandTo;
      };
      trvw.isLeaf = function(node) {
        return trvw.children(node).length === 0;
      };
      trvw.getNodeTpl = function() {
        return localOpts.nodeTpl;
      };
      trvw.root = function() {
        return $scope.root;
      };
      trvw.onToggle = function(node) {
        if(localOpts.onToggle) {
          var locals = {
            ivhNode: node,
            ivhIsExpanded: trvw.isExpanded(node),
            ivhTree: $scope.root
          };
          localOpts.onToggle(locals);
        }
      };
      trvw.onCbChange = function(node, isSelected) {
        if(localOpts.onCbChange) {
          var locals = {
            ivhNode: node,
            ivhIsSelected: isSelected,
            ivhTree: $scope.root
          };
          localOpts.onCbChange(locals);
        }
      };
      trvw.titleClick = function(isTitle) {
    	  $scope.showUl = 0;
    	  if($scope.ngSettings && $scope.ngSettings.titleClickCallback){
			  $scope.ngSettings.titleClickCallback(isTitle);
		  }
        };
        trvw.itemClick = function(node) {
        	if(node.orgId && node.org.latitude && node.org.longitude) {
        		$scope.showUl = 0;
        	}
        	if($scope.ngSettings && $scope.ngSettings.itemClickCallback){
  			  $scope.ngSettings.itemClickCallback(node);
  		  }
        };
        trvw.navOrg = function(root){
        	if(!$scope.bakArr) {
        		$scope.bakArr = [];
        		var arr = angular.element("li.ng-isolate-scope");
        		angular.forEach(arr,function(item,index){
        			if(!arr.eq(index).hasClass('ivh-treeview-node-leaf')){
        				$scope.bakArr.push(arr.eq(index));
        			}
        		})
        	}
        	if(!trvw.getFilter()){
        		angular.forEach($scope.bakArr,function(item,index){
        			$scope.bakArr[index].addClass("ivh-treeview-node-collapsed");
        		})
        		return;
        	}
        	angular.forEach($scope.bakArr,function(item,index){
    			if($scope.bakArr[index] && $scope.bakArr[index].text().indexOf(trvw.getFilter()) != -1){
    				$scope.bakArr[index].removeClass("ivh-treeview-node-collapsed");
    			}else{
    				$scope.bakArr[index].addClass("ivh-treeview-node-collapsed");
    			}
    		})
        }
    }],
    link: function(scope, element, attrs) {
      var opts = scope.trvw.opts();
      if(opts.validate) {
        ivhTreeviewMgr.validate(scope.root, opts);
      }
      //scope.btnLabel = scope.ngSettings.title;
      scope.showUl = 0;
      
    },
    template: [
      '<div class="btn-group">',
      '<button class="btn btn-warning" ng-click="trvw.titleClick(1)">{{ngSettings.title}}</button>',
      '<button class="btn btn-warning dropdown-toggle" ng-click="showUl = !showUl;"><span class="caret"></span></button>',
       '<ul class="ivh-treeview Allgroup" ng-show="showUl">',
       	'<li ng-if="toCompany == 0" ng-click="trvw.titleClick(0)"><a class="pointer">返回项目公司视图</a></li>',
       '<li ng-show="toCompany == 0"><input type="text" ng-click="$event.stopPropagation();" ng-model="filter" ng-change="trvw.navOrg()" class="form-control" placeholder="过滤"></li>',
        '<li ng-repeat="child in root | ivhTreeviewAsArray"',
            'ng-hide="trvw.hasFilter() && !trvw.isVisible(child)"',
            'class="ivh-treeview-node"',
            'ng-class="{\'ivh-treeview-node-collapsed\': !trvw.isExpanded(child) && !trvw.isLeaf(child)}"',
            'ivh-treeview-node="child"',
            'ivh-treeview-depth="0">',
        '</li>',
      '</ul></div>'
    ].join('\n')
  };
}]);
angular.module('ivh.treeview').filter('ivhTreeviewAsArray', function() {
  'use strict';
  return function(arr) {
    if(!angular.isArray(arr) && angular.isObject(arr)) {
      return [arr];
    }
    return arr;
  };
});
angular.module('ivh.treeview').factory('ivhTreeviewBfs', ['ivhTreeviewOptions', function(ivhTreeviewOptions) {
  'use strict';
  var ng = angular;
  return function(tree, opts, cb) {
    if(arguments.length === 2 && ng.isFunction(opts)) {
      cb = opts;
      opts = {};
    }
    opts = angular.extend({}, ivhTreeviewOptions(), opts);
    cb = cb || ng.noop;
    var queue = []
      , childAttr = opts.childrenAttribute
      , next, node, parents, ix, numChildren;
    if(ng.isArray(tree)) {
      ng.forEach(tree, function(n) {
        queue.push([n, []]);
      });
      next = queue.shift();
    } else {
      next = [tree, []];
    }
    while(next) {
      node = next[0];
      parents = next[1];
      if(cb(node, parents) !== false) {
        if(node[childAttr] && ng.isArray(node[childAttr])) {
          numChildren = node[childAttr].length;
          for(ix = 0; ix < numChildren; ix++) {
            queue.push([node[childAttr][ix], [node].concat(parents)]);
          }
        }
      }
      next = queue.shift();
    }
  };
}]);
angular.module('ivh.treeview').factory('ivhTreeviewCompiler', ['$compile', function($compile) {'use strict';
  return {
    compile: function(element, link) {
      if(angular.isFunction(link)) {
        link = { post: link };
      }
      var compiledContents;
      return {
        pre: (link && link.pre) ? link.pre : null,
        post: function(scope, element, attrs, trvw) {
          if(!compiledContents) {
            compiledContents = $compile(trvw.getNodeTpl());
          }
          compiledContents(scope, function(clone) {
            element.append(clone);
          });
          if(link && link.post) {
            link.post.apply(null, arguments);
          }
        }
      };
    }
  };
}]);
angular.module('ivh.treeview').factory('ivhTreeviewMgr', ['ivhTreeviewOptions', 'ivhTreeviewBfs', function(ivhTreeviewOptions, ivhTreeviewBfs) {'use strict';
    var ng = angular,options = ivhTreeviewOptions(),exports = {};
    var makeDeselected = function(node) {
      node[this.selectedAttribute] = false;
      node[this.indeterminateAttribute] = false;
    };
    var makeSelected = function(node) {
      node[this.selectedAttribute] = true;
      node[this.indeterminateAttribute] = false;
    };
    var validateParent = function(node) {
      var children = node[this.childrenAttribute],selectedAttr = this.selectedAttribute,indeterminateAttr = this.indeterminateAttribute,
      numSelected = 0,numIndeterminate = 0;
      ng.forEach(children, function(n, ix) {
        if(n[selectedAttr]) {
          numSelected++;
        } else {
          if(n[indeterminateAttr]) {
            numIndeterminate++;
          }
        }
      });
      if(0 === numSelected && 0 === numIndeterminate) {
        node[selectedAttr] = false;
        node[indeterminateAttr] = false;
      } else if(numSelected === children.length) {
        node[selectedAttr] = true;
        node[indeterminateAttr] = false;
      } else {
        node[selectedAttr] = false;
        node[indeterminateAttr] = true;
      }
    };
    var findNode = function(tree, node, opts, cb) {
      var useId = isId(node),proceed = true,idAttr = opts.idAttribute;
      var foundNode = null,foundParents = [];
      ivhTreeviewBfs(tree, opts, function(n, p) {
        var isNode = proceed && (useId ? node === n[idAttr] :node === n);
        if(isNode) {proceed = false;foundNode = n;foundParents = p;}
        return proceed;
      });
      return cb(foundNode, foundParents);
    };
    var isId = function(val) {
      return ng.isString(val) || ng.isNumber(val);
    };
    exports.select = function(tree, node, opts, isSelected) {
      if(arguments.length > 2) {
        if(typeof opts === 'boolean') {
          isSelected = opts;
          opts = {};
        }
      }
      opts = ng.extend({}, options, opts);
      isSelected = ng.isDefined(isSelected) ? isSelected : true;
      var useId = isId(node)
        , proceed = true
        , idAttr = opts.idAttribute;
      ivhTreeviewBfs(tree, opts, function(n, p) {
        var isNode = proceed && (useId ?node === n[idAttr] :node === n);
        if(isNode) {
          proceed = false;
          var cb = isSelected ?
            makeSelected.bind(opts) :
            makeDeselected.bind(opts);
          ivhTreeviewBfs(n, opts, cb);
          ng.forEach(p, validateParent.bind(opts));
        }
        return proceed;
      });
      return exports;
    };
    exports.validate = function(tree, opts, bias) {
      if(!tree) {
        return exports;
      }
      if(arguments.length > 1) {
        if(typeof opts === 'boolean') {
          bias = opts;
          opts = {};
        }
      }
      opts = ng.extend({}, options, opts);
      bias = ng.isDefined(bias) ? bias : opts.defaultSelectedState;
      var selectedAttr = opts.selectedAttribute
        , indeterminateAttr = opts.indeterminateAttribute;
      ivhTreeviewBfs(tree, opts, function(node, parents) {
        if(ng.isDefined(node[selectedAttr]) && node[selectedAttr] !== bias) {
          exports.select(tree, node, opts, !bias);
          return false;
        } else {
          node[selectedAttr] = bias;
          node[indeterminateAttr] = false;
        }
      });
      return exports;
    };
    exports.expand = function(tree, node, opts, isExpanded) {
      if(arguments.length > 2) {
        if(typeof opts === 'boolean') {
          isExpanded = opts;
          opts = {};
        }
      }
      opts = ng.extend({}, options, opts);
      isExpanded = ng.isDefined(isExpanded) ? isExpanded : true;
      var useId = isId(node),expandedAttr = opts.expandedAttribute;
      if(!useId) {
        node[expandedAttr] = isExpanded;
        return exports;
      }
      return findNode(tree, node, opts, function(n, p) {
        n[expandedAttr] = isExpanded;
        return exports;
      });
    };
    return exports;
  }
]);
angular.module('ivh.treeview').provider('ivhTreeviewOptions', ['ivhTreeviewInterpolateStartSymbol', 'ivhTreeviewInterpolateEndSymbol',
    function(ivhTreeviewInterpolateStartSymbol, ivhTreeviewInterpolateEndSymbol) {'use strict';
  var symbolStart = ivhTreeviewInterpolateStartSymbol,symbolEnd = ivhTreeviewInterpolateEndSymbol;
  var options = {
    idAttribute: 'id',
    labelAttribute: 'label',
    childrenAttribute: 'children',
    selectedAttribute: 'selected',
    expandToDepth: 0,
    useCheckboxes: false,
    validate: true,
    indeterminateAttribute: '__ivhTreeviewIndeterminate',
    expandedAttribute: '__ivhTreeviewExpanded',
    defaultSelectedState: true,
    nodeTpl: [
      '<div class="ivh-treeview-node-content" title="{{trvw.label(node)}}">',
        '<span ivh-treeview-toggle>',
          '<span class="ivh-treeview-twistie-wrapper" ivh-treeview-twistie></span>',
        '</span>',
        '<span class="ivh-treeview-checkbox-wrapper" ng-if="trvw.useCheckboxes()"',
            'ivh-treeview-checkbox>',
        '</span>',
        '<span class="ivh-treeview-node-label" ng-click="trvw.itemClick(node)">',
          '{{trvw.label(node)}}',
        '</span>',
        '<div ivh-treeview-children></div>',
      '</div>'
    ].join('\n')
    .replace(new RegExp('{{', 'g'), symbolStart)
    .replace(new RegExp('}}', 'g'), symbolEnd)
  };
  this.set = function(opts) {
    angular.extend(options, opts);
  };
  this.$get = function() {
    return function() {
      return angular.copy(options);
    };
  };
}]);