// Copyright 2011, Klaus Ganser <kganser.com>
// Licensed under the BSD License.
// http://yuilibrary.com/license/

YUI.add("jsml", function(Y) {
  Y.namespace("jsml");
  Y.jsml = function(node, parent, clear) {
    if (clear && parent) while (parent.firstChild) parent.removeChild(parent.firstChild);
    switch (typeof node) {
      case "object":
        if (node) {
          switch (node.constructor) {
            case Object:
              for (var tag in node) if (node.hasOwnProperty(tag)) { node = node[tag]; break; }
              tag = document.createElement(tag);
              if (node) {
                if (typeof node == "object") {
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
              }
              parent = parent ? parent.appendChild(tag) : tag;
              if (node) Y.jsml(node, parent);
              break;
            case Array:
              node.forEach(function(child) { Y.jsml(child, parent); });
              break;
            default:
              Y.jsml(String(node), parent);
          }
        }
        break;
      case "function":
        Y.jsml(node(parent), parent);
        break;
      case "string":
      case "number":
      case "boolean":
        if (parent) parent = parent.appendChild(document.createTextNode(node));
    }
    return parent;
  };
});
