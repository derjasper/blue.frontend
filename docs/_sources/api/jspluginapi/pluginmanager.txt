Plugin Manager
==============

The plugin manager which hosts all plugins.

An plugin should be created like this:

.. code-block:: javascript

    (function (Plugins) {

        Plugins.fn.plugin_name = function (args) {
            var elm = this; // the function is called in the context of the current DOM Element

            // do preprocessing of parameters here (determine DOM Elements, calculate values, define helper functions)

            return {
                enable: function () {
                    // enable the plugin
                },
                disable: function () {
                    // undo everything the enable function does
                }
            }
            // return null if the args are invalid
        }

        Plugins.fn.plugin_name.args = { // default arguments
            required_param: Plugins.REQUIRED, // required param
            param2: value, // default value
            param3: value
        };
        Plugins.fn.plugin_name.key = ["required_param","param1"]; // list of arguments to identify an instance

    }(blue.Plugins));

A plugin is a function with parameters and returns an object with an enable and 
disable function. An argument list and a key definition as seen in the example is
required, too.

The plugin manager makes sure that the plugin instance (identified by the key) is
not applied twice to a DOM Element. The returned object is created when a plugin
is enabled an an Element end will be destroyed after it has been disabled.

The disable function must not assume that the current DOM Element is inserted in
the DOM tree.

Whenever a DOM Element is moved in the DOM tree, the library using the Plugin API
has to disable and re-enable the plugin; so the plugins and the Plugin Manager
do not care about this. 

The args parameter of the factory function is used one time only. Default values
are automatically added if keys are undefined. The Plugin Manager throws an 
error if required parameters are not set. Each used argument must be defined
in the arguments list.


A plugin can be used like this:

.. code-block:: javascript

    blue.Plugins.use(elm,plugin_name,args_obj,true); // enable
    blue.Plugins.use(elm,plugin_name,args_obj,false); // disable


JavaScript
----------

.. js:function:: blue.Plugins(elm,plugin,args,setEnabled)

   Sets the ``plugin`` with the given ``args`` for ``elm`` enabled or disabled
   depending on ``setEnabled``.

   :param Element elm: A DOM Element.

   :param string plugin: Plugin name.

   :param object args: Associative array of arguments.

   :param boolean setEnabled: ``treu`` for enabled, ``false`` for disabled.

.. js:data:: blue.Plugins.fn

   An object containing all plugins.

.. js:data:: blue.Plugins.REQUIRED

   Constant for marking an argument as required.