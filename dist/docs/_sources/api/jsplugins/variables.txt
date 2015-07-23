Variables
=========

Variables are used to exchange status information of elements between plugins.
They are used in the :doc:`trigger` and :doc:`expressionlistener` plugins. The
foundation is built by the :doc:`../jspluginapi/variables` API.

Most plugins using the  API do some preprocessing. These "conventions" are
described here.
The variable system is explained in :doc:`../jspluginapi/variables`, please read
it first.

We distinguish between preprocessed *variables*, *keys*  and *expressions*.


Preprocessed Variables
----------------------

Variable names are used to initialize a variable. It contains only the name of
the variable without group/stack values. Most plugins preprocess the variable
names using the Selectors API to provide generic names. Please read
:doc:`../jspluginapi/selectors` for available keywords.


Preprocessed Keys
-----------------

Preprocessed keys are a comma-seperated list of keys as described in 
:doc:`../jspluginapi/variables`. Each key is preprocessed using 
:doc:`../jspluginapi/selectors`.


Preprocessed Expressions
------------------------

These are expressions as described in :doc:`../jspluginapi/variables` plus
preprocessing unsing :doc:`../jspluginapi/selectors`.


Initialisation
--------------

The initialisation is done with a preprocessed variable name, an initial
value (which is also preprocessed) and a variable type, which can be
``simple``, ``group`` or ``stack``. In case of a simple variable, this has
to be ``true`` or ``false``.

For more information read the documentation of the Variables API.


JavaScript
----------

.. js:function:: Plugins.fn.variable_init(variable,value,type)

   Adds an offset element to the top to the current context.

   :param string variable: Preprocessed variable name.

   :param string value: Preprocessed value.

   :param string type: Data type, ``"simple"``, ``"group"`` or ``"stack"``.

   :returns: An object providing enable and disable functions.