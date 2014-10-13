Scroll Position
===============

Scroll position allows to respond to scroll positions.

A trigger can be created for an element. This trigger has a target and will toggle
a class at the target element when the trigger element is scrolled to the viewports
top.
Each trigger has a group, and only one trigger per group can be active. That means,
when a trigger reaches the viewports top, the trigger is set to active and all other triggers
are set to inactive. 

This module uses scroll area offsets (see :doc:`blueleaf`).

The target expression is a jQuery selector OR one of these strings: ``_null`` for
no target (useful for disabling all triggers of the group) or ``_link`` which can
be applied to anchors (``a[name]``) and chooses all links pointing to this anchor 
as target (``a[href=#...]``) (useful for single page navigation).

This module will be integrated into the trigger module in a future release.


SASS
----

.. describe:: @mixin scrollposition($target:"_null",$group:"default",$scrolled_class:"scrolled")

   Creates a trigger.

   .. describe:: $target
    
      Target selector.

   .. describe:: $group

      Trigger group.

   .. describe:: $scrolled_class

      Class to be applied to the target if the trigger is active. Useful for different
      triggers with the same target.

.. describe:: @mixin bp-scrolled($scrolled_class:"scrolled")

   Pseudo-breakpoint valid if the target is triggered.
   This mixin should be applied to targets.

   .. describe:: $scrolled_class

      Class.

JS
--

.. js:function:: $.scrollposition_enable(target_expr,group,scrolled_class)

   Adds a trigger with the given parameters.

   :param string target_expr: Target selector.

   :param string group: Group.

   :param string scrolled_class: Class.

.. js:function:: $.scrollposition_disable(target_expr,group)

   Removes a trigger identified by the given parameters.

   :param string target_expr: Target selector.

   :param string group: Group.