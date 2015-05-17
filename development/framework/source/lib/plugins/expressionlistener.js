(function ($,Plugins,Variables,Selectors) { 
    Plugins.fn.expressionlistener_class = function (args) {
        var elm = this;
        
        var listener = function(value) {
            if  (value) {
                $(elm).addClass(args.element_class);
                $(elm).removeClass(args.element_class+"_off");
            }
            else {
                $(elm).removeClass(args.element_class);
                $(elm).addClass(args.element_class+"_off");
            }
        };

        args.expression = Selectors.generate(args.expression,elm);
        
        return {
            enable: function () {
                Variables.on(elm,args.expression,listener);
            },
            disable: function () {
                Variables.off(elm,args.expression,listener);
            }
        }
    }
    Plugins.fn.expressionlistener_class.args = {
        element_class: Plugins.REQUIRED,
        expression: Plugins.REQUIRED
    };
    Plugins.fn.expressionlistener_class.key = ["element_class"];
    
    Plugins.fn.expressionlistener_focus = function (args) {
        var elm = this;
        
        var listener = function(value) {
            if (value) {
                $(elm).focus();
            }
        };

        args.expression = Selectors.generate(args.expression,elm);
                
        return {
            enable: function () {
                Variables.on(elm,args.expression,listener);
            },
            disable: function () {                
                Variables.off(elm,args.expression,listener);
            }
        }
    }
    Plugins.fn.expressionlistener_focus.args = {
        expression: Plugins.REQUIRED
    };
    Plugins.fn.expressionlistener_focus.key = ["expression"];
    
    Plugins.fn.expressionlistener_set = function (args) {
        var elm = this;
        
        // process key
        var keyList = args.key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }

        // process expressions
        args.value_expression = Selectors.generate(args.value_expression,elm);
        args.expression = Selectors.generate(args.expression,elm);
        
        var listener = function() {                    
            var val = Variables.eval(elm,args.value_expression);
            for (var i=0;i<keyList.length;i++) {
                Variables.set(elm,keyList[i],val);
            }
        };
                
        return {
            enable: function () {
                Variables.on(elm,args.expression,listener);
            },
            disable: function () {
                Variables.off(elm,args.expression,listener);
            }
        }
    }
    Plugins.fn.expressionlistener_set.args = {
        expression: Plugins.REQUIRED,
        key: Plugins.REQUIRED,
        value_expression: Plugins.REQUIRED
    };
    Plugins.fn.expressionlistener_set.key = ["expression","key"];
}(jQuery,blue.Plugins,blue.Variables,blue.Selectors));