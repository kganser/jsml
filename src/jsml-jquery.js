// Copyright 2011, Klaus Ganser <kganser.com>
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://jquery.org/license

(function($) {

  var jsml = function(node, parent, clear) {
    if (clear && parent) while (parent.firstChild) parent.removeChild(parent.firstChild);
    switch (typeof node) {
      case "object":
        if (node) {
          switch (node.constructor) {
            case Object:
              for (var tag in node) if (node.hasOwnProperty(tag)) { node = node[tag]; break; }
              tag = document.createElement(tag);
              if (node && typeof node == "object") {
                if (node.constructor == Object) {
                  var attrs = node;
                  node = undefined;
                } else if (node.constructor == Array && typeof node[1] == "object" && node[1] && node[1].constructor == Array) {
                  var attrs = node[0];
                  node = node[1];
                } else {
                  var attrs = undefined;
                }
                for (var attr in attrs) if (attrs.hasOwnProperty(attr)) tag[attr] = attrs[attr];
              }
              parent = parent ? parent.appendChild(tag) : tag;
              if (node) jsml(node, parent);
              break;
            case Array:
              node.forEach(function(child) { jsml(child, parent); });
              break;
            default:
              jsml(String(node), parent);
          }
        }
        break;
      case "function":
        jsml(node(parent), parent);
        break;
      case "string":
      case "number":
      case "boolean":
        if (parent) parent = parent.appendChild(document.createTextNode(node));
    }
    return parent;
  };

  $.fn.jsml = function(node, clear) {
    return this.each(function() {
      jsml(node, this, clear);
    });
  };
})(jQuery);
