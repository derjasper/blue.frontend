Scrolling
=========

This module provides some scrolling-related features.


SASS
----

.. describe:: @mixin smoothscrolling($time:1000)

   Can be applied to a link (``a`` HTML tag) that points to a hash. When the link
   is clicked, the page is crolled to the target in ``$time`` ms. Note that this
   cannot be used in combination with :doc:`trigger` and the hash in the url will not
   be updated.

   .. describe:: $time

      The time in ms.


.. describe:: @mixin scrollareaoffset($offset)
   
   If there are fixed element at the top of the viewport (such as :doc:`sticky`),
   jumplinks does not work correctly. This mixin adds an offset to the jumplink.
   Jumplink correction will be automated in future.

   .. describe:: $offset

      The offset as an CSS length.


JavaScript
----------

.. js:function:: $.smoothscrolling_enable(time)

   Enables the smooth scrolling feature.

   :param int time: Time in ms.

   

.. js:function:: $.smoothscrolling_disable()

   Disables the smooth scrolling feature.



.. js:function:: $.scrollareaoffset_enable(offset)

   Enables the scroll area offset feature. (No function at this time.)

   :param int time: Offset.

   

.. js:function:: $.scrollareaoffset_disable()

   Disables the scroll area offset feature.



.. js:function:: $.scrollareaoffset()

   Returns the scroll area offset.

   :returns: Offset.