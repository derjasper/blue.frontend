Expression Listener
===================

The SASS binding of the :doc:`../jsplugins/expressionlistener` JavaScript plugin.
Plase read those lines to understand how the variables system works.

SASS
----

.. describe:: @mixin listen($expression,$element_class:"triggered")

   Listens to the ``$expression`` and toggles the ``$element_class`` depending
   on the evaluation result. The expression is evaluated in the context of the
   current element.

   .. describe:: $expression

      A preprocessed expression.

   .. describe:: $element_class

      A class name. If the expression evaluates to ``true``, the class ``$element_class``
      is added to the current element. Otherwise, ``$element_class+"_off"`` is added
      instead.

.. describe:: @mixin bp-triggered($element_class:"triggered") { @content; }

   Pseudo-breakpoint, valid if ``$trigger_class`` is added.

   .. describe:: $element_class

      Class.

.. describe:: @mixin bp-untriggered($element_class:"triggered") { @content; }

   Pseudo-breakpoint, valid if ``$trigger_class+"_off"`` is added.

   .. describe:: $element_class

      Class.

.. describe:: @mixin bp-listen($expression,$element_class:"") { @content; }

   Pseudo-breakpoint, valid if ``$expression`` is ``true``. This is a shorthand
   mixin for ``listen`` and ``bp-triggered``.

   .. describe:: $expression

      A preprocessed expression.

   .. describe:: $element_class

      A class name. If the expression evaluates to ``true``, the class ``$element_class``
      is added to the current element. Otherwise, ``$element_class+"_off"`` is added
      instead. If this parameter is empty, a unique class name is generated.

.. describe:: @mixin listen_focus($expression)

   Listens to the ``$expression`` and sets the focus to the current element whenever
   the expression evaluates to ``true``.

   .. describe:: $expression

      A preprocessed expression.

.. describe:: @mixin listen_set($expression,$key,$value_expression)

   Listens to the ``$expression`` and sets the ``$key`` to ``$value_expression``.
   The context of the current element is always used.

   .. describe:: $expression

      A preprocessed expression.

   .. describe:: $key

      A comma-seperated list of preprocessed keys.

   .. describe:: $value_expression

      A preprocessed expression.