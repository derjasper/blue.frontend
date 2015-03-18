Off Canvas
==========

The offcanvas module is - at the moment - a very basic shorthand for offcanvas elements.
It supports toggling the visibility of the element and uses the :doc:`trigger` module.

An *offcanvas* element is invisible at the start and can be toggled via an *offcanvas-toggle*.
Each offcanvas element has an identifier.


SASS
----

.. describe:: @mixin offcanvas($var)

   An offcanvas element which is invisible until it its visibility is toggled by an ``offcanvas-toggle``.

   .. describe:: $var

      Preprocessed offcanvas identifier.

.. describe:: @mixin offcanvas-toggle($var)

   A toggle that toggles the visibility of the offcanvas element that belongs to ``$var``.

   .. describe:: $var

      The preprocessed identifier of the ``offcanvas`` element.