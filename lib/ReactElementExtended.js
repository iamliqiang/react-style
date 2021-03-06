'use strict';

var ReactElement  = require('react/lib/ReactElement');
var assign        = require("react/lib/Object.assign");
var applyStyles   = require('./applyStyles');

var helperObj = {

};

function buildProps(props) {
  var builtProps = {
    className: props.className || null,
    style: props.style ? assign({}, props.style) : null,
    styles: undefined
  };
  applyStyles(builtProps, props.styles, 0, null, helperObj.maxOverridesLength);
  return builtProps;
}

var originalCreateElement = ReactElement.createElement;
ReactElement.createElement = function(type, props) {
  var args = arguments;
  var children;
  if (args.length > 2) {
    children = Array.prototype.slice.call(args, 2);
  }
  if (props && props.styles && !props.__reactStyleOld &&
    typeof type === 'string') {
    props = assign(props, buildProps(props));
    props.__reactStyleOld = true;
  }
  return originalCreateElement.apply(this, [type, props, children]);
};

module.exports = helperObj;
