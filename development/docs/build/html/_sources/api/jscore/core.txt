blue leaf JavaScript core
=========================

The core scans all CSS files for custom rules, listens on DOM changes and media
querys and en-/disables the rules.

On how the custom rules magic works, read :doc:`../sassmodules/customrules`.


JavaScript
----------

core.js
*******

.. js:data:: blueleaf.customrules.ruleslist

   A list of defined custom rules.

.. js:data:: blueleaf.customrules.properties

   An associative array of properties:
   ``properties[mediaquery].selectors[selector][i] = {rule: rule, options: options};``

.. js:data:: blueleaf.customrules.enabledProperties

   A map containing information of enabled properties per DOM element:
   ``enabledProperties.get(DOMElement)[i]="mediaquery~selector~i";``

.. js:function:: blueleaf.customrules.addRule(rule,options)

   Registers a new rule.

   :param string rule: Identifier of the rule.

   :param options: An object containing two functions: ``{enable:function(elm,options){...}, disable:function(elm,options){...}}``.
                   The ``enable`` function will be called whenever a rule should be applied to a DOM Element (``elm``) with the given
                   ``options`` (usually defined via SASS). This happens for example if a media query gets true.
                   The same is valid for ``disable``.

.. js:function:: blueleaf.customrules.addProperty(mq,sel,rule,options)

   :param string mq: Media Query.

   :param string sel: Selector.

   :param string rule: Rule identifier.
 
   :param object options: An associative array of options.

.. js:function:: blueleaf.customrules.parseStyleSheet(css)

   A style sheet to be parsed and added to ``ruleslist``.

   :param string css: The stylesheet.

.. js:function:: blueleaf.customrules.enableProperty(elm,mq,sel,index)

   Enables a property.

   :param Element elm: A DOM element.

   :param string mq: Media Query.

   :param string sel: Selector.

   :param string index: Property index.

.. js:function:: blueleaf.customrules.disableProperty(elm,mq,sel,index)

   Disables a property. Parameters are the same as in ``enableProperty``.

.. js:function:: blueleaf.customrules.apply()

   *Deprecated* Re-applys JavaScript-based rules. (If you need to use this, it's a bug.)

.. js:function:: blueleaf.customrules.init()

   Initializes the custom rules. After the init, no more rules or properties can
   be added. blue leaf will handle media querys and DOM changes, the framework 
   should be mostly transparent to the developer.


cssparser.js
************

.. js:class:: CSSParser(css)

   :param string css: A string containing the CSS stylesheets.

.. js:function:: CSSParser.parse()

   Parses the ``CSSParser``s CSS.

   :returns: ``true`` if parsing was successful, otherwise ``false``.

.. js:attribute:: CSSParser.tree

   Contains a tree containing custom rules with their selectors and media querys.
   Only valid if ``CSSParser.parse()`` has returned ``true``.