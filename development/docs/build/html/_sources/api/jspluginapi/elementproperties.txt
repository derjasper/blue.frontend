Element Properties
==================

The Element Properties API allows to listen on element property changes. Listeners
can be attached to properties of DOM Elements. The core will handle DOM Mutations
and resize events and call listeners when specific properties changed.


Available Properties
--------------------

.. describe:: "css.[value]"

   A CSS value. The ``[value]`` is a CSS value from jQuery.

.. describe:: "offset.left", "offset.top"

   Element offset (jQuery)

.. describe:: "position.left", "position.top"

   Element position (jQuery)

.. describe:: "scroll.left", "scroll.top"

   ScrollTop and ScrollLeft (jQuery)

.. describe:: "width", "height"

   width/height (jQuery)

.. describe:: "width.inner", "height.inner"

   width/height (jQuery)

.. describe:: "width.outer", "height.outer"

   width/height (jQuery)

.. describe:: "width.outerWithMargin", "height.outerWithMargin"

   width/height (jQuery)


JavaScript
----------

Public API
**********

.. js:function:: ElementProperty.on(element, property, handler)

   Attach the ``handler`` to the ``property`` of the ``element``.

   :param Element element: DOM Element.

   :param string proptery: The property (for details see above).

   :param function handler: A handler. Will be called as ``handler(newVal, oldVal)``.

.. js:function:: ElementProperty.off(element, property, handler)

   Remove a handler.

   :param Element element: DOM Element.

   :param string proptery: The property.

   :param function handler: The handler.


Private functions (not for use from outside)
********************************************

.. js:function:: ElementProperty.fire(element, property, newVal, oldVal)

   Call all handlers related to the given parameters.

.. js:function:: ElementProperty.getProperty(element, property)

   Get the property of the element.

.. js:function:: ElementProperty.check(element, property)

   Check for changes for the given element and properties (it's a list). Both parameters
   can be ``undefined``, which will perform checks for all elements/properties.

.. js:function:: ElementProperty.start()

   Start the engines.