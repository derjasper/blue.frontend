Trigger
=======

The trigger module allows to define UI interactions from SASS. Events like clicks
and mouseovers toggle a class of an element.

A *trigger* (click,mouseover,mouseout) toggles, turns on or turns off a class of its *target*.
Also, the handlers can have priorities which allows to control the order they are executed.

Target expressions
------------------
The target is specified by a selector, which has some extended functionality explained below.

Target expressions are jQuery selectors plus these ones:

.. describe:: {this}

   Can be placed everywhere in the selector an will be replaced by the id of the current
   element (and NOT the selector).

.. describe:: {parent-x}

   Can be placed everywhere in the selector an will be replaced by the id of the parent
   number x. {parent-1} will be the first parent, {parent-2} will be the element two levels
   higher.

.. describe:: {attr-x}

   Can be placed everywhere in the selector an will be replaced by the contents of the
   attribute of the current element. For example, it allows to put the target element
   in the attribute ``data-target`` by using ``{attr-data-target}`` as the target expression.


SASS
----

.. describe:: @mixin trigger($target_expr,$trigger_class:"trigger",$type:click,$trigger_mode:toggle,$priority:0)

   Defines a trigger.

   .. describe:: $target_expr

      A target expression (see above) for the target to be triggered.

   .. describe:: $trigger_class
   
      Class to be triggered.

   .. describe:: $type

      ``click``, ``mouseover``, ``mouseout``; Type of the event of the current element to 
      trigger the target.

   .. describe:: $trigger_mode

      ``toggle``, ``on``, ``off``; Specifies if the class of the target will be toggled,
      turned on or off.

   .. describe:: $priority

      The handler's priority. The higher the number the later the handler will be executed.

.. describe:: @mixin triggered($trigger_class:"trigger") { @content; }

   Sets class ``$trigger_class`` of the current element triggered at startup.

   .. describe:: $trigger_class

      Class to be set to ``on``.

.. describe:: @mixin bp-triggered($trigger_class:"trigger") { @content; }

   Pseudo-breakpoint, valid when the ``$trigger_class`` is set to ``on``.

   .. describe:: $trigger_class

      Class.

.. describe:: @mixin bp-untriggered($trigger_class:"trigger") { @content; }

   Pseudo-breakpoint, valid when the ``$trigger_class`` is set to ``off``.

   .. describe:: $trigger_class

      Class.


JavaScript
----------

.. js:function:: $.trigger_enable(type,target_expr,trigger_class,trigger_mode,priority)

   Adds a trigger to the current element. See SASS docs for more details.

   :param string type: Trigger type, ``click``, ``mouseover``, mouseout``.

   :param string target_expr: Target expression.

   :param string trigger_class: Class.

   :param string trigger_mode: Trigger mode, ``toggle``, ``on``, ``off``.

   :param int priority: Priority.

.. js:function:: $.trigger_disable(type,target_expr,trigger_class)

   Disables the trigger matching to the given parameters.

   :param string type: Trigger type.

   :param string target_expr: Target expression.

   :param string trigger_class: Class.

.. js:function:: $.trigger_set(trigger_class,mode)

   Triggers the class with the given mode on the current element directly.

   :param string trigger_class: Class.

   :param string trigger_mode: Trigger mode, ``toggle``, ``on``, ``off``.