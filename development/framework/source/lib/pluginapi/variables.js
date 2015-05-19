{
    // TODO get rid of jQuery.data
    // TODO use maps and sets
    // TODO checkfire() slow
    // Variables
    blue.Variables = {
        addVariable: function (elm, variable, value, type) { // type: simple, group, stack
            var vars = jQuery.data(elm, "variables");
            if (vars == null) {
                vars = {};
                jQuery.data(elm, "variables", vars);
            }

            if (type == "simple") {
                vars[variable] = {initial: value, value: value, type: type};
            }
            else if (type == "group") {
                vars[variable] = {initial: value, value: value, type: type};
            }
            else {
                vars[variable] = {initial: value, value: [value], type: type};
            }

            this.checkfire(elm, variable);
        },
        removeVariable: function (elm, variable) {
            var vars = jQuery.data(elm, "variables");
            if (vars == null) {
                return;
            }
            delete vars[variable];

            this.checkfire(elm, variable);
        },
        getVariable: function (elm, variable) { // get a directly attached variable
            var vars = jQuery.data(elm, "variables");

            if (vars == null)
                return undefined;

            return vars[variable];
        },
        setVariable: function (elm, key, value) { // set a directly attached variable
            var k = key.split(".");

            var variable = this.getVariable(elm, k[0]);

            if (variable == undefined) {
                if (elm == document.documentElement) {
                    this.addVariable(elm, key, value, "simple");
                    variable = this.getVariable(elm, key);
                }
                else {
                    return false;
                }
            }

            this.setVal(variable, k[1], value);

            this.checkfire(elm, k[0]);

            return true;
        },
        getVal: function (variable, sub) { // process a variables value
            if (variable.type == "simple") {
                return variable.value;
            }
            else if (variable.type == "group") {
                return variable.value == sub;
            }
            else {
                return variable.value[variable.value.length - 1] == sub;
            }
        },
        setVal: function (variable, sub, value) { // process the input to a variable value
            if (variable.type == "simple") {
                variable.value = value;
            }
            else if (variable.type == "group") {
                if (value) {
                    variable.value = sub;
                }
                else {
                    variable.value = variable.initial;
                }
            }
            else {
                if (value) {
                    if (variable.value[variable.value.length - 1] != sub)
                        variable.value.push(sub);
                }
                else {
                    variable.value = jQuery.grep(variable.value, function (value) {
                        return value != sub;
                    });
                }
            }
        },
        get: function (context, key) { // get a variable in the current context
            var current = context;
            var k = key.split(".");

            while (current != null) {
                var val;
                if ((val = this.getVariable(current, k[0])) != undefined)
                    return this.getVal(val, k[1]);

                current = current.parentNode;
            }
            return false;
        },
        _expr_get_var_paths: function (expression) {
            var vars = expression.replace(/(&&|\|\||!|\(|\))/g, " ").split(" ");
            var names = [];

            for (var i = 0; i < vars.length; i++) {
                vars[i] = vars[i].trim();
                if (vars[i] !== "" && vars[i] !== "true" && vars[i] !== "false" && jQuery.inArray(vars[i], names) == -1) {
                    names.push(vars[i]);
                }
            }

            return names;
        },
        eval: function (context, expression) { // evaluate an expression in the given context
            // supported: (,),&&,||,!,true,false and variables

            var re = /[^(&&|\|\||!|\(|\))]+(?=(|&&|\|\||!|\(|\)))/g;
            var offset = 0;
            var matches = [];
            var match;
            while ((match = re.exec(expression)) != null) {
                matches.push(match);
            }
            for (var i = 0; i < matches.length; i++) {
                if (matches[i][0] === "true" || matches[i][0] === "false")
                    continue;

                var value = this.get(context, matches[i][0]) + "";

                expression = expression.substring(0, matches[i].index + offset) + value + expression.substring(matches[i].index + offset + matches[i][0].length, expression.length);
                offset += value.length - matches[i][0].length;
            }

            return eval(expression);
        },
        set: function (context, key, value) { // set a variable
            var current = context;

            while (current != document && current != null) {
                if (this.setVariable(current, key, value))
                    return;

                current = current.parentNode;
            }
        },
        on: function (context, expression, fn) { // fn: fn(value)
            var lstnr = jQuery.data(context, "variables-listener");
            if (lstnr == null) {
                lstnr = {};
                jQuery.data(context, "variables-listener", lstnr);
            }

            var listener = {
                expression: expression,
                fn: fn,
                lastval: false,
                context: context
            };

            var vars = this._expr_get_var_paths(expression);

            for (var i = 0; i < vars.length; i++) {
                var varname = vars[i].split(".")[0];

                var temp = lstnr[varname];
                if (temp == undefined) {
                    temp = [];
                    lstnr[varname] = temp;
                }

                temp.push(listener);
            }

            listener.last = this.eval(context, expression);
            fn(listener.last);
        },
        off: function (context, expression, fn) {
            var lstnr = jQuery.data(context, "variables-listener");
            if (lstnr == null) {
                return;
            }

            var vars = this._expr_get_var_paths(expression);

            for (var i = 0; i < vars.length; i++) {
                var varname = vars[i].split(".")[0];

                if (lstnr[varname] == undefined) {
                    return;
                }

                lstnr[varname] = jQuery.grep(lstnr[varname], function (val) {
                    return val.expression != expression && val.fn != fn;
                });
            }

            if (this.eval(context, expression)) {
                fn(false);
            }
        },
        checkfire: function (context, variable) { // check and fire listeners if necessary
            // check if listeners are set
            var listener = jQuery.data(context, "variables-listener");
            if (listener != null) {
                var fns = listener[variable];
                if (fns != null) {
                    // fire listeners if neccessary
                    for (var i = 0; i < fns.length; i++) {
                        var newValue = this.eval(fns[i].context, fns[i].expression);

                        if (fns[i].last != newValue) {
                            fns[i].last = newValue;
                            fns[i].fn(newValue);
                        }
                    }
                }
            }

            // propagate changes to children
            var children = context.children;
            for (var i = 0; i < children.length; i++) {
                if (this.getVariable(children[i], variable) == undefined) {
                    this.checkfire(children[i], variable);
                }
            }
        }
    };


}