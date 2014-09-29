Reset
=====

Mixins for easily resetting CSS rules.


SASS
----

.. describe:: @mixin reset($flags...)

   Reset styles.

   .. describe:: $flags...

      ``all-initial``, ``all-inherit``, ``all-unset``, ``margin``, ``padding``, ``display``, ``text-align``

      Defaults to ``margin,padding``.


.. describe:: @mixin reset-p($mode,$properties...)

   Resets ``$properties`` to ``$mode``.

   .. describe:: $mode

      ``inherit``, ``initial`` or ``unset``. Same as in CSS.

   .. describe:: $properties...

      Properties to reset. ``all`` to reset all. (``all`` is supported in Firefox only.)