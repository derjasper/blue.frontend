Variables
=========

This is the SASS binding for the Variables plugin. Please read
:doc:`../jsplugins/variables` for usage information.

Convention: blue.frontend modules should only create variables starting with "bl-".


SASS
----

.. describe:: @mixin initvar($variable,$value:false,$type:"simple")

   Initializes a variable at the current element

   .. describe:: $variable

      A preprocessed variable name.

   .. describe:: $value

      A preprocessed value. In case of a simple variable type, this has to be
      ``true`` or ``false``, otherwise it is a string.

   .. describe:: $type

      The variable type; ``simple``, ``group`` or ``stack``.

   