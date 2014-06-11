// Copyright 2014, Klaus Ganser <http://kganser.com>
// MIT Licensed, with this copyright and permission notice
// <http://opensource.org/licenses/MIT>

(window.kernel || {add: function(name, module) { window[name] = module(); }}).add('jsml', function() {

  var jsml, attr = function(node, parent) {
    Object.keys(node).forEach(function(k) {
      if (k == 'children') return;
      var n = node[k];
      if (!parent.hasOwnProperty(k) || typeof n != 'object' || n == null)
        return parent[k] = n;
      attr(n, parent[k], true);
    });
    return node.children;
  };
  
  return jsml = function(node, parent) {
    switch (typeof node) {
      case 'object': // Object, Array, or null
        if (!node) return;
        if (Array.isArray(node))
          return node.map(function(node) { return jsml(node, parent); });
        var tag = Object.keys(node)[0],
            elem = document.createElement(tag);
        node = node[tag];
        children = jsml(typeof node == 'object' && node && !Array.isArray(node) ? attr(node, elem) : node, elem);
        if (Array.isArray(children))
          children.forEach(function(child) { if (child) elem.appendChild(child); });
        else if (children)
          elem.appendChild(children);
        return elem;
      case 'function':
        return jsml(node(parent), parent);
      case 'string':
      case 'number':
        return document.createTextNode(node);
    }
  };
});
