Trigger
=======

The trigger plugin is a collection of rules that allows to set variables dependent
on some events.

First you have to understand how the Variables System works and know about the
terminology, so start with reading about :doc:`variables`.


Trigger
-------

Simple triggers set a key to an expression whenever a specific event occurs
on the current element. These are ``click``, ``mouseover``, ``mouseout``,
``focus`` and ``blur``.


Trigger Bindings
----------------

Trigger bindings set a key to the status of an element. Available are
``hover`` and ``focus``.


Trigger Scrollposition Bindings
-------------------------------

A key is bound to the position of the element relative to the scroll area. 
There are five different states an element can obtain: ``visible``, ``top``,
``bottom``, ``left`` and ``right``. For example ``top`` means that the element
has left the visible area of the scroll area to the top.


JavaScript
----------

.. js:function:: Plugins.fn.trigger(key,event_type,value_expression,priority)

   Adds a trigger to the current element. Everything is interpreted in the context
   of the current element.

   :param string key: Comma-seperated list of preprocessed keys.

   :param string event_type: Event type; ``click``, ``mouseover``, ``mouseout``,
                             ``focus`` or ``blur``.

   :param string value_expression: A preprocessed expression that will be evaluated whenever
                                   the given event occurs. The key will be set to the result.

   :param number priority: If more than one trigger is triggered with a single click
          (even trigger of different DOM Elements), the priority states the order of
          the execution of the trigger (the higher the number the later it will be executed).

   :returns: An object providing enable and disable functions.

.. js:function:: Plugins.fn.trigger_bind(key,status_type)

   Adds a trigger binding to the current element. Everything is interpreted in the context
   of the current element.

   The key is set to the current status of the current element whenever the status
   has changed.

   :param string key: Comma-seperated list of preprocessed keys.

   :param string status_type: Status type; ``hover`` or ``focus``.

   :returns: An object providing enable and disable functions.

.. js:function:: Plugins.fn.trigger_bind_scrollposition(key,scroll_status,scrollarea,offset)

   Adds a trigger binding to the current element. Everything is interpreted in the context
   of the current element.

   The key is set to the current status of the current element whenever the status
   has changed.

   :param string key: Comma-seperated list of preprocessed keys.

   :param string scroll_status: ``visible``, ``top``, ``bottom``, ``left`` or ``right``.

   :param string scrollarea: A preprocessed selector (using :doc:`../jspluginapi/selectors`) which
          selects the scroll area (e.g. a parent element with overflow:auto). Set to ``"window"``
          to use the window as scroll area.

   :param object offset: An associative array of offsets. Offsets reduce the scroll area
          at the given sides of the scroll area. The object might look like this:
          ``{top:0,right:0,bottom:0,left:0}``. All offsets are scaled by ``px``.

   :returns: An object providing enable and disable functions.