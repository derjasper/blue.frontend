Plugin Manager
==============

The plugin manager which hosts all plugins.

An plugin should be created like this:

.. code-block:: javascript

    Plugins.fn.plugin_name = function (param1,param2) {
        var elm = this.elm;
        return {
            enable: function () {
                // ...
            },
            disable: function () {
                // ...
            }
        }
    }

A plugin is a function with parameters and returns an object with an enable and 
disable function. Use jQuery.data to store element related stuff, because the
object is not stored all the time, the plugin function is called every time it is
needed. ``this.elm`` is the current context and contains a DOM Element.

A plugin must make sure that a rule cannot be applied twice. It has to check if
a rule has already be applied. This has to be decided dependent on the given
parameters.

Also, when disabling a plugin, the plugin must not assume that the current Element is
inserted in the DOM tree, it may be removed already. For example, the Selectors
API cannot be used in the ``disable`` function of the plugin since die Selectors
API needs to know about the parents. But it is important, that everything the
``enable`` function does is made undone by the ``disable`` function.

A plugin can be used like this:

.. code-block:: javascript

    Plugins(elm).plugin_name(param1,param2).enable();


JavaScript
----------

.. js:function:: Plugins(elm)

   Returns an object with the elements context for use in plugin functions.

   :param Element elm: A DOM Element.

.. js:data:: Plugins.fn

   An object containing all plugin functions.