(function ($) {
    Plugins.fn.variable_init = function (args) {
        var elm = this;
        
         // process variable
        args.variable = Selectors.generate(args.variable,elm);

        // process value
        if (args.type!="simple") args.value = Selectors.generate(args.value,elm);
        
        return {
            enable: function () {
                Variables.addVariable(elm,args.variable,args.value,args.type);
            },
            disable: function () {
                Variables.removeVariable(elm,args.variable);
            }
        }
    };
    
    Plugins.fn.variable_init.args = {
        variable: Plugins.REQUIRED,
        value: false,
        type: "simple" // type: simple, group, stack
    };
    Plugins.fn.variable_init.key = ["variable"];
}(jQuery));