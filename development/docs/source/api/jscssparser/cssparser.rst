JavaScript CSS Parser
=====================

The CSS Parser can be run in any environment. It can be used in browsers and for
preprocessing (e.g. Grunt).


JavaScript
----------

cssparser.js
************

.. js:function:: CSSParser.parse(css)

   Parses the given CSS into an JavaScript object tree.

   :param string css: A string containing the CSS stylesheets.

   :returns: A tree containing custom rules: ``tree[mediaQuery][selector][i][rule]={option: value}``