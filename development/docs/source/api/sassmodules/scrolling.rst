Scrolling
=========

This module provides some scrolling-related features.


SASS
----

.. describe:: @mixin scroll-offset($offset)
   
   If there are fixed element at the top of the viewport (such as :doc:`sticky`),
   jumplinks does not work correctly. This mixin adds an offset to the jumplink.
   (This mixin will be replaced with a more flexible solution in a future release.)

   .. describe:: $offset

      The offset as an CSS length (any unit).