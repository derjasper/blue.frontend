(function ($) { 
    Plugins.fn.expressionlistener_class = function (element_class,expression) { // TODO buggy?
        var elm = this.elm;
        return {
            enable: function () {
                if ($.data(elm,"expressionlistener_class-"+element_class)) return;
                
                var listener = function(value) {
                    if  (value) {
                        $(elm).addClass(element_class);
                        $(elm).removeClass(element_class+"_off");
                    }
                    else {
                        $(elm).removeClass(element_class);
                        $(elm).addClass(element_class+"_off");
                    }
                };
                
                expression = Selectors.generate(expression,elm);
                
                $.data(elm,"expressionlistener_class-"+element_class,{listener: listener,expression: expression});
                Variables.on(elm,expression,listener);
            },
            disable: function () {
                var data = $.data(elm,"expressionlistener_class-"+element_class);
                if (data==undefined) return;
                $.removeData(elm,"expressionlistener_class-"+element_class); // TODO überall removedata überprüfen!!!
                
                Variables.off(elm,data.expression,data.listener);
            }
        }
    }
    
    Plugins.fn.expressionlistener_focus = function (expression) {
        var elm = this.elm;
        return {
            enable: function () {
                var listener = function(value) {
                    if (value) {
                        $(elm).focus();
                    }
                };
                
                expression = Selectors.generate(expression,elm);
                
                $.data(elm,"expressionlistener_focus-"+expression,listener);
                Variables.on(elm,expression,listener);
            },
            disable: function () {
                var listener = $.data(elm,"expressionlistener_focus-"+expression);
                if (listener==undefined) return;
                $.removeData(elm,"expressionlistener_focus-"+expression);
                
                expression = Selectors.generate(expression,elm);
                
                Variables.off(elm,expression,listener);
                
            }
        }
    }
    
    Plugins.fn.expressionlistener_set = function (expression,key,value_expression) {
        var elm = this.elm;
        
        // process key
        var keyList = key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }

        // process expressions
        value_expression = Selectors.generate(value_expression,elm);
        expression = Selectors.generate(expression,elm);
                
        return {
            enable: function () {
                if ($.data(elm,"expressionlistener_set-"+expression+"-"+key)!=undefined) return;
                
                var listener = function() {                    
                    var val = Variables.eval(elm,value_expression);
                    for (var i=0;i<keyList.length;i++) {
                        Variables.set(elm,keyList[i],val);
                    }
                };
                
                $.data(elm,"expressionlistener_set-"+expression+"-"+key,listener);
                Variables.on(elm,expression,listener);
            },
            disable: function () {
                var listener = $.data(elm,"expressionlistener_set-"+expression+"-"+key);
                if (listener==undefined) return;
                $.removeData(elm,"expressionlistener_set-"+expression+"-"+key);
                                
                Variables.off(elm,expression,listener);
            }
        }
    }
}(jQuery));