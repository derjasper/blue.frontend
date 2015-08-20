Predefined Rules
================

Predefined rules are CSS classes defined by blue.frontend.

Normally, blue.frontend does not create any CSS rules for specific classes. If a module
defines such rules it should happen via the ``predefine`` mixin in order to allow site 
developers to disable these rules.

Predefined rules can be turned off via the ``$predefined`` variable in :doc:`blue`.

Note: These mixins are not for use from outside the framework. They are documented
for framework developers.


SASS
----

.. describe:: @mixin predefine($classname,$flags...) { @content }

   Predefines a CSS rule for the given ``$classname``.

   .. describe:: $classname

      The CSS class name.

   .. describe:: $flags...

      Some flags to specify how the rules have to be defined. Currently, this has no function.

   .. describe:: @content

      CSS rules.