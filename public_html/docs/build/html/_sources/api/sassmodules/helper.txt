Helper
======

These are helper functions which are intended for internal use and are subject
to change, you may not rely on these functions. They are listed here for 
framework developers.


SASS
----

.. describe:: @function replace-nth($list, $index, $value)

   Replaces the ``$index`` s entry of the list ``$list`` with ``$value`` and
   returns the result.

   .. describe:: $list

      The list.

   .. describe:: $index

      The index.

   .. describe:: $value

      The value.

   Returns the result.


.. describe:: @function multiply-list($factor,$values)

   Multiplys each entry of ``$values`` with ``$factor`` and returns the result.

   .. describe:: $factor

      The factor.

   .. describe:: $values

      The list.

   Returns the result.