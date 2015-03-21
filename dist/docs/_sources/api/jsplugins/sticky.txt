Sticky
======

This plugin enables sticky elements. They can stick to a scroll area's edges and
can be hold inside a parent element.


JavaScript
----------

.. js:function:: Plugins.fn.sticky(directions, scrollarea_sel, container_sel, sticky_class)

   Makes the current element sticky.

   Add margin and z-index to the element's ``sticky_class`` to define offsets and stacking
   behaviour.

   :param object directions: A map containing boolean values for ``top`` and ``bottom`` keys.
          Indecates at which edges of the scroll area the element will stick.

   :param string scrollarea_sel: jQuery selector for the scroll area (it looks for
          the first parent matching the selector). Use ``"viewport"`` to use the window.

   :param string container_sel: jQuery selector for the parent element to stay in (it looks for
          the first parent matching the selector). The element will stop sticking 
          if it would leave its container.

   :param string sticky_class: A class to be applied when sticked.

   :returns: An object providing enable and disable functions.