Reset
=====

Mixins for easily resetting CSS rules.


SASS
----

.. describe:: @mixin reset($mode:initial,$properties...:(all))

   Resets ``$properties`` to ``$mode``.

   .. describe:: $mode

      ``inherit``, ``initial`` or ``unset``. Same as in CSS.

   .. describe:: $properties...

      Properties to reset. ``all`` to reset all. (``all`` is supported in Firefox only.)


    Some Examples:

    - ``@include reset(margin, padding, text-align);`` resets the given properties to initial (implicit)
    - ``@include reset(unset, color);`` unsets the color (explicit)
    - ``@include reset();`` is the same as ``@include reset(all);`` and ``@include reset(initial,all);``