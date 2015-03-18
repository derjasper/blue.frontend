Creating jQuery-Plugins from the Plugin API
===========================================

Creating a jQuery-Plugin from the Plugin API is traight forward:

.. code-block:: javascript

    (function($) {
        $.fn.plugin_name_enable = function(time) {        
            _fn = function(elm) {
                Plugins(elm).plugin_name(param1,param2).enable();
            }

            for (_i = 0, _len = this.length; _i < _len; _i++) {
                elm = this[_i];
                _fn($(elm));
            }
            return this;
        };


        $.fn.plugin_name_disable = function() {
            _fn = function(elm) {
                Plugins(elm).plugin_name(param1,param2).disable();
            }

            for (_i = 0, _len = this.length; _i < _len; _i++) {
                elm = this[_i];
                _fn($(elm));
            }
            return this;
        };
    }(jQuery));

Thats it. Feel free to automate this.