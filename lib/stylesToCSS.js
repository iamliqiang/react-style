'use strict';

var isUnitlessNumber = require('react/lib/CSSProperty').isUnitlessNumber;
var hyphenateStyleName = require('react/lib/hyphenateStyleName');
var isArray = Array.isArray;
var keys = Object.keys;
var unsupportedPseudoClasses = require('./unsupportedPseudoClasses');

var counter = 1;
// Follows syntax at https://developer.mozilla.org/en-US/docs/Web/CSS/content,
// including multiple space separated values.
var unquotedContentValueRegex = /^(normal|none|(\b(url\([^)]*\)|chapter_counter|attr\([^)]*\)|(no-)?(open|close)-quote|inherit)((\b\s*)|$|\s+))+)$/;

function buildRule(result, key, value) {
  if (!isUnitlessNumber[key] && typeof value === 'number') {
    value = '' + value + 'px';
  }
  else if (key === 'content' && !unquotedContentValueRegex.test(value)) {
    value = "'" + value.replace(/'/g, "\\'") + "'";
  }

  result.css += '  ' + hyphenateStyleName(key) + ': ' + value + ';\n';
}

function buildRules(result, rules, selector) {
  if (!rules || keys(rules).length === 0) {
    return result;
  }

  result.css += selector + ' {\n';
  var styleKeys = keys(rules);
  for (var j = 0, l = styleKeys.length; j < l; j++) {
    var styleKey = styleKeys[j];
    var value = rules[styleKey];

    if (unsupportedPseudoClasses[styleKey.split('(')[0].trim()]) {
      if ("production" !== process.env.NODE_ENV) {
        console.warn('You are trying to use pseudo class ' + styleKey +
        ', which we don\'t support as this is better implemented using ' +
        'JavaScript.');
      }

      continue;
    }

    if (isArray(value)) {
      for (var i = 0, len = value.length; i < len; i++) {
        buildRule(result, styleKey, value[i]);
      }
    }
    else {
      buildRule(result, styleKey, value);
    }
  }
  result.css += '}\n';

  return result;
}

function replicateSelector(s, max) {
  var maxLength = max || 10;
  var replicatedSelector = [];
  for (var i = 0; i < maxLength; i++) {
    var newSelector = '';
    for (var j = 0, l2 = i + 1; j < l2; j++) {
      newSelector += s + (j !==0 ? j : '');
    }
    replicatedSelector[i] = newSelector;
  }
  return replicatedSelector.join(',');
}

function buildStyle(result, style, selector, maxLength) {
  if (!style.className) {
    return;
  }

  if (!selector && result.classNames[style.className]) {
    return;
  }

  if (!selector) {
    result.classNames[style.className] = counter++;
    selector = replicateSelector('.' + style.className, maxLength);
  }

  buildRules(result, style.style, selector);
}

function stylesToCSS(styles, maxLength) {
  if (!isArray(styles)) {
    styles = [styles];
  }

  var result = {css: '', classNames: {}};
  for (var i = 0, len = styles.length; i < len; i++) {
    var style = styles[i];
    buildStyle(result, style, null, maxLength);
  }
  return result;
}

module.exports = stylesToCSS;
