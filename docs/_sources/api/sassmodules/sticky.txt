Sticky
======

The sticky mixin allows to create elements which stick at the top or bottom of
the viewport (or another scroll area) when they are scrolled to these borders.
Also, sticky elements can have a parent element they will never leave (see demo
browser for details). 

This module works with :doc:`scrolling`. It uses the :doc:`../jsplugins/sticky`
JavaScript plugin.


SASS
----

.. describe:: @mixin sticky($directions:"_default", $scrollarea_sel:"viewport", $container_sel:"_null", $sticky_class: "bl-sticked")

   Creates a sticky element.

   .. describe:: $directions
   
      A map containing boolean values for ``top`` and ``bottom`` keys. ``"_default"``
      equals ``(top: true)``.

   .. describe:: $scrollarea_sel

      Selector for the scroll area (jQuery selector, looks for the first parent 
      matching the selector).

   .. describe:: $container_sel

      Selector for the parent container (jQuery selector, looks for the first parent 
      matching the selector).
      
   .. describe:: $sticky_class
   
      Class to be applied when the element is sticked.

.. describe:: @mixin bp-sticked($sticky_class: "bl-sticked") { @content; }

   Pseudo-breakpoint valid when the current element is sticked.

.. describe:: @mixin sticky-offset($offsets,$sticky_class: "bl-sticked")

   Offset for the element.

.. describe:: @mixin sticky-zindex($z-index,$sticky_class: "bl-sticked")

   Z-index to be applied when sticked.