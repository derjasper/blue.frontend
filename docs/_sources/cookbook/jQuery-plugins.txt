Creating jQuery-Plugins from the Plugin API
===========================================

Creating a jQuery-Plugin from the Plugin API is traight forward:

.. code-block:: javascript

    (function($) {
        $.fn.plugin_name_enable = function(args_obj) {        
            _fn = function(elm) {
                Plugins.use(elm,plugin_name,args_obj,true);
            }

            for (_i = 0, _len = this.length; _i < _len; _i++) {
                elm = this[_i];
                _fn($(elm));
            }
            return this;
        };


        $.fn.plugin_name_disable = function(args_obj) {
            _fn = function(elm) {
                Plugins.use(elm,plugin_name,args_obj,false);
            }

            for (_i = 0, _len = this.length; _i < _len; _i++) {
                elm = this[_i];
                _fn($(elm));
            }
            return this;
        };
    }(jQuery));

Thats it. Feel free to automate this.

Note that this is a very basic bridge. You need to dis- and enable all the plugins
if an element is moved in the DOM tree (see :doc:`../api/jspluginapi/pluginmanager`), and disable all plugins 
whenever an element is destroyed.