List
====

Easy list (ul and ol) styling.

Options to set list layout, spacings, indents and block elements. Ability to apply
styles according to the list level.

Lists styled with these mixins can be aligned with :doc:`alignment`.


SASS
----

.. describe:: @mixin list-level($level,$up:true) { @content; }

   Styles to be applied to the given ``$level``. If ``$up`` is set to true, styles
   are also applied to sub-levels.

   .. describe:: $level

      The list level. ``0`` is the root level.

   .. describe:: $up

      Indicates whether styles are applied to sub-levels or not.

.. describe:: @mixin list-layout($type)

   Sets the list layout. List-style and margin/paddings are resetted. Neccessary
   for all other list mixins to work properly.
   Should be used as a ``list-level`` content.

   .. describe:: $type

      The type. Possible values:

      .. describe:: horizontal

         Horizontal list. Includes a workaround (see source for details) which can
         lead to unexpected behaviour. If this is a problem, use ``horizontal-nofix``,
         ``horizontal-fl`` or ``horizontal-fr`` instead (not supported, see source 
         for details).

      .. describe:: vertical

         Vertical list.

.. describe:: @mixin list-gutter($type,$spacing...)

   List-specific gutter mixin, should be used instead of ``gutter`` in lists.
   Should be used as a ``list-level`` content.

   Uses non-standard CSS, see source code for details.

   .. describe:: $type

      ``inner`` or ``outer``; outer gutter is the padding of *li* elements, inner
      gutter of block elements (see ``list-blicklink`` mixin) inside *li* elements.

   .. describe:: $spacing...
   
      Spacing, see :doc:`gutter`.

.. describe:: @mixin list-structure-spacing($spacing)

   Indent for the child list level.
   Should be used as a ``list-level`` content.

   .. describe:: $spacing

      A number indicating the indent.

.. describe:: @mixin list-blocklink()

   Makes all child elements of *li* elements a block element (eg ``display:block;``).
   Should be used as a ``list-level`` content.