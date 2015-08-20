Container
=========

One of the most important modules. Containers are block elements with sizing, 
positioning, alignment and spacing options.

Some sizing options are multiplied by the ``$container`` factor, defined in :doc:`blue`.

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

      Aspect ration uses :doc:`../jsplugins/container`.

   .. describe:: $height

      Same as ``$width``.

   .. describe:: $flags...:(center)

      There are flags available defining some more behaviour.

      *Positioning*

      The position will be ``position:relative`` (``relative``) unless one of these flags is set.
      Only one of them is possible:

      .. describe:: absolute

         Absolute positioning.

      .. describe:: fixed

         Fixed positioning. Think about using :doc:`sticky` instead.

      .. describe:: static

         Static positioning. Not recommended, rare use cases.

      Additionally, the keyword ``extended`` (alias ``xt``) can be used to enable
      extended algorithms width more aligning options (see below for details).
      Extended algorithms use ``transform`` which lead to unwanted behaviour in some
      cases. Note that containers using ``extended`` can only be overwritten by
      containers using ``extended``. To overwrite properties, use media querys where
      possible.

      *Alignment*

      Only one flag per direction should be set (one vertical and one horizontal).

      Please read the note at the end of this list.


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


      Note that the availability of alignment flags is heavily dependent from the
      positioning model.

      ``static`` works with ``left``,``center``,``right`` when a ``width`` is specified.

      ``relative`` works with ``left``,``center``,``right``.

      ``absolute`` and ``fixed`` works width everything. But: For using ``center`` or
      ``middle``, ``ẁidth`` respectively ``height`` has to be specified.

      With ``extended`` flag set, everything will work as expected for ``relative``,
      ``absolute`` and ``fixed``; independent from ``width`` and ``height``.
      Note that relative positioned my have unexpected vertical alignment. In those
      cases use the absolute positioning model.
         
      *Floating*
      
      Adds floating to the container. Do not use in combination with alignment.
      Use with static and relative positioning is supported.
      
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
