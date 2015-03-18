Custom Rules
============

The custom rule feature is the most unique feature of this framework. It makes
JavaScript code invocable from SASS depending on media querys.

Note: This module is not intended for use from outside the framework. It is documented
for framework developers.

**How it works**

The SASS mixin will create a CSS comment with an JSON object generated
from SASS maps, which will look as follows:

.. code-block:: css

   /*! customrule: {rulename: {option1: value, option2: value, enabled:true}} */


Now, blue leaf's JavaScript will parse all CSS files beginning with ``/*! blueleaf */``
for these comments and parse the JSON objects. The JSON objects will be stored
in association with the current media query and the current CSS rule.

The core handles media querys and DOM changes and will en- and disable rules
properly.

For now, rules cannot be overwritten (use media querys to disable them).
(Will be improved in future.)

Please study the source code for more details. 


SASS
----

.. describe:: @mixin customrule($rule,$map)

   Defines a custom rule. The character ``"`` is not allowed in $rule and $map.

   .. describe:: $rule

      Name of the rule.

   .. describe:: $map

      Map with configuration.