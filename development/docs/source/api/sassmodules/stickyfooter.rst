Sticky Footer
=============

A footer with an background different from the body's looks ugly if the content
is too short and the footer is not at the bottom of the page. There are some CSS
workarounds which are unflexible.

This module uses the :doc:`../jsplugins/stickyfooter` JavaScript plugin.


SASS
----

.. describe:: @mixin stickyfooter($parent:"html")

   The current element "sticks" at the bottom of the ``$parent`` element if the
   content is too short.

   .. describe:: $parent

      Selector for the parent element containing the content (not preprocessed
      because it looks only for parent elements).