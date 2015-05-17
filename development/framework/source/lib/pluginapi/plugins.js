{
    // Plugins
    blue.Plugins = {
        REQUIRED: "_required_argument",
        fn: {},
        instances: new Map(),
        use: function (elm, plugin, args, setEnabled) { // TODO Plugins.use slow
            var instances = this.instances.get(elm);
            if (instances == undefined)
                instances = new Map();
            this.instances.set(elm, instances);

            var pluginObj = this.fn[plugin];
            if (pluginObj == undefined)
                throw "Plugin API: Plugin " + plugin + " not found.";

            // set defaults
            var pArg = {};
            for (var cArg in pluginObj.args) {
                if (args[cArg] == undefined) {
                    var cArgVal = pluginObj.args[cArg];
                    if (cArgVal == this.REQUIRED) {
                        throw "Plugin API: Plugin " + plugin + " could not be instanciated because parameter " + cArg + " was invalid";
                    }
                    else {
                        pArg[cArg] = cArgVal;
                    }
                }
                else {
                    pArg[cArg] = args[cArg];
                }
            }

            // generate key
            var key = plugin;
            for (var i = 0; i < pluginObj.key.length; i++)
                key += "~" + pArg[pluginObj.key[i]];

            // check if instance already exists
            var instance = instances.get(key);

            if (setEnabled == false && instance != undefined) { // disable
                instance.disable();
                instances.delete(key);
            }
            else if (setEnabled == true && instance == undefined) { // enable
                instance = pluginObj.bind(elm)(pArg);

                if (instance != null) {
                    instances.set(key,instance);
                    instance.enable();
                }
            }
        }
    };
}