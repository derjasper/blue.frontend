(function ($) {
    Plugins.fn.variable_init = function (variable,value,type) { // type: simple, group, stack
        var elm = this.elm;
        
        // process variable
        variable = Selectors.generate(variable,elm);
        
        // process value
        if (type!="simple") value = Selectors.generate(value,elm);
        
        return {
            enable: function () {
                Variables.addVariable(elm,variable,value,type);
            },
            disable: function () {
                Variables.removeVariable(elm,variable);
            }
        }
    }
}(jQuery));