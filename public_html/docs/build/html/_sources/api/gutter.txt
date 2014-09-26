Gutter
======

The gutter module is there for consistent inner spacings of elements. The
scaling can be configured via the ``$gutter`` variable in :doc:`blueleaf`.


SASS
----

.. describe:: @mixin gutter($spacing...)

   Adds an inner spacings to the given element. Can savely be applied to
   :doc:`container` and :doc:`grid` elements. Optimized mixins are available for
   :doc:`menu` and :doc:`list`, please refer to the respective pages for details.

   .. describe:: $spacing

      Map or arguments with inner spacings, same as CSS's padding/margin values
      (e.g. ``1,2,3,4`` or ``1,2,3`` or ``1,2`` or ``1``). 