Sticky Footer
=============

A footer with an background different from the body's looks ugly if the content
is too short and the footer is not at the bottom of the page. There are some CSS
workarounds which are unflexible. This module is a solution based on JavaScript.


SASS
----

.. describe:: @mixin stickyfooter($parent:"html")

   The current element "sticks" at the bottom of the ``$parent`` element if the
   content is too short.

   .. describe:: $parent

      Selector fot the parent element containing the content.


JavaScript
----------

.. js:function:: $.stickyfooter_enable(parent_selector)

   Enables the stickyfooter feature.

   :param string parent_selector: Selector for the parent element.

   

.. js:function:: $.stickyfooter_disable()

   Disables the stickyfooter feature.