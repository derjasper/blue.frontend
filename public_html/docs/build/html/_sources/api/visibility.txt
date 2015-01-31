Visibility
==========

The visibility module is intended to provide a simple API for visibility-related
features.


SASS
----

.. describe:: @mixin visible($mode)

   Sets the visibility of the current element. Old mixin ``visibility`` is available
   as alias for legacy support.

   .. describe:: $mode

      The possible modes are:

      .. describe:: hide

         Excluded from the rendering tree, ``display:none;``

      .. describe:: invisible

         Invisible, but still uses the space, ``visibility:hidden;``

      .. describe:: show

         Show as (inline) element, ``display:initial;``

      .. describe:: showblock

         Show as block element, ``display:block;``

      .. describe:: hidecontent

         Hide (inline) content. May be used to replace text with images. Use
         with buttons, as seen in the demo.
         
      .. describe:: visuallyhidden

         Hide element visually, but show them for screen readers.