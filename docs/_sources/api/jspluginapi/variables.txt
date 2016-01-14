Variables
=========

The Variables API allows plugins to store boolean values attached to a DOM Element
(the context) and should only be used for cross-plugin communication (otherwise use
jQuery.data). It supports a scope-like behaviour, expressions, basic data structures
and listeners.


The context
-----------

Variables are initialized in a context (a DOM Element). This means, that they are
attached to the element. If a variable is initialized with the same name as a
variable attached to an anchestor, the anchestor's variable cannot be accessed from
this element and all descendants, instead, the current element's variable will be
used.

When accessing a variable, the first variable when going up in the DOM tree starting
from the context element context element will be used.
If the variable is not initialized, the value will always be false.


Variable types
--------------

A variable can be a ``simple`` variable, a ``group`` or a ``stack``.

Please note: To initialize a variable, we use variable names. To set a variable to
a specific value, we use *keys*.


simple variable
***************

Holds a single boolean value.

Initialize: ``Variables.addVariable([context],"[varname]",[boolean_value],"simple")``

Set to a value: ``Variables.set([context],"[varname]",[boolean_value])``.

Accessing a value: ``Variables.get([context],"[varname]")``.


group
*****

Can hold any value (which is evaluated as true).

Initialize: ``Variables.addVariable([context],"[varname]","[any_value]","group")``

Set to a value: ``Variables.set([context],"[varname].[value]",[boolean_value])``
(If ``[boolean_value]`` is ``true``, the value of the ``variable``
will be changed to ``[value]``)

Accessing a value: ``Variables.get([context],"[varname].[value]")``
(If the value of ``[varname]`` is ``[value]``, the function returns true)


stack
******

A stack containing values.

Initialize: ``Variables.addVariable([context],"[varname]","[any_value]","stack")``
(The stack will contain ``[any_value]`` at the top of the stack)

Set to a value: ``Variables.set([context],"[varname].[value]",[boolean_value])``
(If ``[boolean_value]`` is ``true``, the ``[value]`` will be
pushed on top of the stack, otherwise all occurences of ``[value]`` will be
removed from the stack)

Accessing a value: ``Variables.get([context],"[varname].[value]")``
(If the head of ``[varname]`` is ``[value]``, the function returns true)


Expressions
-----------

An expression is a combination of variable keys and logic operators. Supported are
``&&``, ``||``, ``(``, ``)``, ``!``, ``true`` and ``false``. Everything else is
interpreted as a variable key.

For example, ``group.value&&(!stack.value||varname)&&false`` is a valid expression.

Expressions can be evaluated using ``Variables.eval(context,expression)``.


Listener
--------

A listener listens to an expression and is called whenever the result of the
expression is changed (and when it is added or removed). 


JavaScript
----------

Public API
**********

.. js:function:: blue.Variables.addVariable(elm,variable,value,type) 

   Attaches a variable to the given element.

   :param Element elm: DOM Element.

   :param string variable: Variable name.

   :param value: Boolean value or string.
   
   :param string type: ``"simple"``, ``"group"`` or ``"stack"``

.. js:function:: blue.Variables.removeVariable(elm,variable) 

   Removes a variable from the given element.

   :param Element elm: DOM Element.

   :param string variable: Variable name.   

.. js:function:: blue.Variables.eval(context,expression)

   Evaluates an expression (see above).

   :param Element context: DOM Element.

   :param string expression: Expression.

   :return: A boolean value.

.. js:function:: blue.Variables.set(context,key,value)

   Sets the value of the key.

   :param Element context: DOM Element.

   :param string key: The key (see section "variable types" for more details).

   :param boolean value: The value.

.. js:function:: blue.Variables.on(context,expression,fn)

   Adds a listener to the expression evaluated in the given context.

   :param Element context: DOM Element.

   :param string expression: Expression.

   :param function fn: The listener, should have a parameter to receive the current value.

.. js:function:: blue.Variables.off(context,expression,fn)

   Removes a listener from the expression evaluated in the given context.

   :param Element context: DOM Element.

   :param string expression: Expression.

   :param function fn: The listener.