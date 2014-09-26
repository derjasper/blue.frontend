Alignment
=========

The alignment module is for aligning inline content, NOT to align container
inside their parents.


SASS
----

.. describe:: @mixin align($flags...)

   Aligns inline content within the current element. Can savely be applied to
   :doc:`container` and :doc:`grid` elements. Can be used to align :doc:`menu`
   and :doc:`list`.

   .. describe:: $flags

      ``left``,``center``,``right`` (for horizontal alignment)