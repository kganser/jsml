// Copyright 2014, Klaus Ganser <http://kganser.com>
// MIT Licensed, with this copyright and permission notice
// <http://opensource.org/licenses/MIT>

(function($) {

  var attr = function(node, parent) {
    Object.keys(node).forEach(function(k) {
      if (k == 'children') return;
      var n = node[k];
      if (typeof parent[k] == 'undefined' || typeof n != 'object' || n == null)
        return parent[k] = n;
      attr(n, parent[k], true);
    });
    return node.children;
  };
  
  $.jsml = function(node, parent) {
    switch (typeof node) {
      case 'object': // Object, Array, or null
        if (!node) return;
        if (Array.isArray(node)) {
          node.forEach(function(node) { $.jsml(node, parent); });
          return parent;
        }
        var tag = Object.keys(node)[0],
            elem = document.createElement(tag);
        if (parent) parent.appendChild(elem); 
        node = node[tag];
        $.jsml(typeof node == 'object' && node && !Array.isArray(node) ? attr(node, elem) : node, elem);
        return elem;
      case 'function':
        return $.jsml(node(parent), parent);
      case 'string':
      case 'number':
        node = document.createTextNode(node);
        return parent ? parent.appendChild(node) : node;
    }
  };
  
  $.fn.jsml = function(node) {
    return this.each(function() {
      $.jsml(node, this);
    });
  };
})(jQuery);
