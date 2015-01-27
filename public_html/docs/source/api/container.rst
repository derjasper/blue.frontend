Container
=========

One of the most important modules. Containers are block elements with sizing, 
positioning, alignment and spacing options.

Some sizing options are multiplied by the ``$container`` factor, defined in :doc:`blueleaf`.

This module will be reworked in a very future release.

Note: Due to the fact that CSS ``transform`` property creates a new stacking context,
z-index may not work as expected (by most devs). Please read :doc:`stacking`
for more details.


SASS
----

.. describe:: @mixin container($width:auto,$height:auto,$flags...)

   Defines a *container*.

   .. describe:: $width

      *Keywords*

      The following keywords can be used:
          
      - ``auto``: browser default sizing
      - ``full``: 100% of parent's width
      - ``screen``: 100% of screen's width

      *Specify a width*

      Width's can be specified without an unit which are scaled by the ``$container``
      factor (in ``rem``). Supported units are ``%``, ``vh``, ``vw``, ``vmin``, ``vmax``.
      Other units are not recommended and are not supported.

      If a map with 1 element or a simple number is given, this will be the maximum width.
      The container will have its parent's width until this value is reached.

      If a map with 2 elements is given, the first will be the minimum width and the
      second the maximum width.
      The container will have its parent's width unless these borders are reached.
      If the values are equal, this will be the (fixed) width of the element.

      *Aspect ratio*
      
      If a list with 2 elements is given, the first element is a number and the second
      element ``ar``, then the width is is relative to the element's height. The
      first element of the list will be used as the scaling factor.

      Do not use aspect ratio on width and height on the same element as this will
      lead to undefined behaviour. Since this feature uses JavaScript, *this rule 
      cannot be overwritten* (this will lead to undefined behaviour). Use :doc:`mediaquerys`
      to disable aspect ratio.

   .. describe:: $height

      Same as ``$width``.

   .. describe:: $flags...:(center)

      There are flags available defining some more behaviour.

      *Positioning*

      The position will be ``position:relative`` unless one of these flags is set.
      Only one of them is possible:

      .. describe:: absolute

         Absolute positioning.

      .. describe:: fixed

         Fixed positioning. Think about using :doc:`sticky` instead.

      *Alignment*

      Only one flag per direction should be set (one vertical and one horizontal).

      Alignment should work with each positioning model and independent from the
      size (it will work with width or height set to ``auto``, too).
      Note that relative positioned elements may be aligned unexpected. In those
      cases use the absolute positioning model.

      .. describe:: left

         Left.

      .. describe:: center

         Center (horizontal).

      .. describe:: right

         Right.

      .. describe:: top

         Top.

      .. describe:: middle

         Middle (vertical).

      .. describe:: bottom

         Bottom.

      .. describe:: outer-top

         Above the parents element. Will be placed outside of the parents element.

      .. describe:: outer-bottom

         Underneath the parents element. Will be placed outside of the parents element.

      .. describe:: outer-left

         Left to the parents element. Will be placed outside of the parents element.

      .. describe:: outer-right

         Right to the parents element. Will be placed outside of the parents element.
         
      *Floating*
      
      Adds floating to the container. Do not use in combination with alignment.
      
      .. describe:: float-none
      
         Explicitly disalbes floating.
         
      .. describe:: float-left
      
         Float left.
         
      .. describe:: float-right
      
         Float right.

.. describe:: @mixin container-spacing($spacing...)

   Outer spacing. Should be used if a positioning flag is set.

   .. describe:: $spacing...

      Spacing (scaled by ``$gutter`` variable), see :doc:`gutter`.

.. describe:: @mixin container-breakout($spacing...)

   Negative outer spacing.

   Will be removed in a future release. Maybe.

   .. describe:: $spacing...

      Spacing (scaled by ``$gutter`` variable), see :doc:`gutter`.


CSS (Predefined Rules)
----------------------

.. describe:: container

   A simple container with default options. 
