Trigger
=======

The trigger module allows to define UI interactions from SASS.

This module is the SASS binding of the :doc:`../jsplugins/trigger` JavaScript plugin,
please read the documentation to understand how variables work and to learn about
what the different trigger mixins do.


SASS
----

.. describe:: @mixin trigger($key,$event_type:"click",$value_expression:"true",$priority:0)

   Adds a trigger to the current element. Everything is interpreted in the context
   of the current element.

   .. describe:: $key
  
      Comma-seperated list of preprocessed keys.

   .. describe:: $event_type

      Event type; ``click``, ``mouseover``, ``mouseout``, ``focus`` or ``blur``.

   .. describe:: $value_expression

      A preprocessed expression that will be evaluated whenever the given event
      occurs. The key will be set to the result.

   .. describe:: $priority

      If more than one trigger is triggered with a single click
      (even trigger of different DOM Elements), the priority states the order of
      the execution of the trigger (the higher the number the later it will be executed).

.. describe:: @mixin trigger_bind($key,$status_type:"hover")

   Adds a trigger binding to the current element. Everything is interpreted in the context
   of the current element.

   The key is set to the current status of the current element whenever the status
   has changed.

   .. describe:: $key

      Comma-seperated list of preprocessed keys.

   .. describe:: $status_type

      Status type; ``hover`` or ``focus``.

.. describe:: @mixin scrollposition($key,$scroll_status:"top",$scrollarea:"window",$offset:())

   Adds a trigger binding to the current element. Everything is interpreted in the context
   of the current element.

   The key is set to the current status of the current element whenever the status
   has changed.

   .. describe:: $key

      Comma-seperated list of preprocessed keys.

   .. describe:: $scroll_status

      ``visible``, ``top``, ``bottom``, ``left`` or ``right``.

   .. describe:: $scrollarea

      A preprocessed selector (using :doc:`../jspluginapi/selectors`) which
      selects the scroll area (e.g. a parent element with overflow:auto). Set to ``"window"``
      to use the window as scroll area.

   .. describe:: $offset

      A map containing offsets. Offsets reduce the scroll area
      at the given sides of the scroll area. The map might look like this:
      ``(top:0,right:0,bottom:0,left:0)``. All offsets are scaled by ``px``.