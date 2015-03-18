Smooth Scrolling
================

Plays a scroll effect when a link is clicked. Uses the :doc:`../jsplugins/smoothscrolling`
JavaScript plugin.

Usage recommondation:

.. code-block:: css

   a[href] {
       @include smoothscrolling();
   }


SASS
----

.. describe:: @mixin smoothscrolling($time:1000)

   Plays a scroll effect when a link is clicked.
   Should be applied to a link that points to an anchor.

   .. describe:: $time

      The duration of the animation.