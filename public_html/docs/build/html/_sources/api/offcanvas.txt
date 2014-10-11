Off Canvas
==========

The offcanvas module is - at the moment - a very basic shorthand for offcanvas elements.
It supports toggling the visibility of the element and uses the :doc:`trigger` module.

An *offcanvas* element is invisible at the start and can be toggled via an *offcanvas-toggle*.


SASS
----

.. describe:: @mixin offcanvas()

   An offcanvas element which is invisible until it its visibility is toggled by an ``offcanvas-toggle``.

.. describe:: @mixin offcanvas-toggle($selector)

   A toggle that toggles the visibility of the ``$selector``.

   .. describe:: $selector

      The selector of the ``offcanvas`` element.