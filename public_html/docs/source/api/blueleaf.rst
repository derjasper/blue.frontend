blue leaf Core
==============

These are some core functionalities and settings which can normally left untouched.

SASS
----

*config*

.. describe:: $gutter

   gutter scaling (default: 0.2rem)


.. describe:: $container

   container scaling (default: 10rem)


.. describe:: $columns

   number of columns (default: 12)


.. describe:: $rows

   number of rows (default: 12)


.. describe:: $screensizes

   map of screen sizes with their ranges

   default: (s: (0em 40em), m: (40.063em 64em), l: (64.063em 90em), xl: (90.063em 120em), xxl: (120.063em))


.. describe:: $predefined

   indicates whether predefined CSS rules should be generated or not (default: true)


*CSS constants*

.. describe:: $inline-elements

   Contains a selector for all inline elements.   


JavaScript
----------

.. js:function:: blueleaf.apply()

   Re-applys JavaScript-based rules. Call it whenever DOM changes are made. (The
   plan is to automate this).

.. js:data:: blueleaf.scrollarea.offset

   Holds information of the scrollarea's offset (has attributes top,right,bottom,left).
   Used to correct jump links in combination with sticky elements.

.. js:function:: blueleaf.scrollarea.changeOffset(newoffset)

   Change the scrollarea's offset.
   
   :param newoffset: Values to be added to the current offset, same structure 
                     as blueleaf.offset.

.. js:data:: blueleaf.customrules.ruleslist

   A list of defined custom rules.

.. js:function:: blueleaf.customrules.registerModuleQuery(rule,options)

   Registers a new rule.

   :param string rule: Identifier of the rule.

   :param options: An object containing two functions: ``{match:function(sel,options){...}, unmatch:function(sel,options){...}}``.
                   The ``match`` function will be called whenever a rule should be applied to a selector(``sel``) with the given
                   ``options`` (usually defined via SASS). This happens for example if a media query gets true.
                   The same is for ``unmatch``.

.. js:function:: blueleaf.customrules.parseStyleSheet(css)

   A style sheet to be parsed. Custom rules and/or media querys will be applied instantly.

   :param string css: The stylesheet.