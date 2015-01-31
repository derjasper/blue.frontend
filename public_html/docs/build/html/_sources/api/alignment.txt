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

      ``top``,``middle``,``bottom`` (for vertical alignment)

      Note that only wrapped content can be aligned vertically.
      Use vertical alignment with care, as it applies ``display:inline-block;``
      to all inline elements. (Except for ``top`` as it will reset all inline
      elements to ``display:inline;``.)

      Also be aware that all vertical alignment flags use ``transform`` which may
      be a cause for unexpected behaviour in some cases.