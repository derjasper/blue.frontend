Selectors
=========

The Selectors API is for convient element selection relative to the current element
(the context). This is done by replacing spcific keyword described below.

This API is not only used for selecting elements, it can also be used to generate
names for Variables (see :doc:`../jsplugins/trigger`) and similiar purposes.

If a plugin uses this API to generate selectors, they should always use jQuery
selectors.


Keywords
--------

.. describe:: {this}

   Can be placed everywhere in the selector an will be replaced by the id of the current
   (context) element.

.. describe:: {parent-x}

   Can be placed everywhere in the selector an will be replaced by the id of the parent
   number x. {parent-1} will be the first parent, {parent-2} will be the element two levels
   higher.

.. describe:: {attr-x}

   Can be placed everywhere in the selector an will be replaced by the contents of the
   attribute of the current element. For example, it allows to put the target element
   in the attribute ``data-target`` by using ``{attr-data-target}`` as the target expression.


JavaScript
----------

.. js:function:: Selectors.generate(selector, context)

   :param string selector: A selector expression.

   :param Element context: The DOM Element the expression refers to.

   :return: A selector string that can be passed to jQuery.