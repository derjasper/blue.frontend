// Map // should be replaced with native map in EMCAScript 6
Map = function () {
    this._dict = [];
}
Map.prototype._get = function (key) {
    for (var i = 0, couplet; couplet = this._dict[i]; i++) {
        if (couplet[0] === key) {
            return couplet;
        }
    }
    return undefined;
}
Map.prototype.put = function (key, value) {
    var couplet = this._get(key);
    if (couplet) {
        couplet[1] = value;
    }
    else {
        this._dict.push([key, value]);
    }
    return this;
}
Map.prototype.get = function (key) {
    var couplet = this._get(key);
    if (couplet) {
        return couplet[1];
    }
    return undefined;
}
Map.prototype.remove = function (key) {
    for (var i = 0, couplet; couplet = this._dict[i]; i++) {
        if (couplet[0] === key) {
            this._dict.splice(i, 1);
            return;
        }
    }
}
Map.prototype.each = function (callback) {
    for (var i = 0, couplet; couplet = this._dict[i]; i++) {
        callback(couplet[0], couplet[1]);
    }
}

// HashMap
HashMap = function (xt) {
    this._dict = {};
    if (xt)
        this._keys = {};
}
HashMap.prototype._shared = {id: 1};
HashMap.prototype.put = function(key, value) {
    if (key instanceof Element) {
        var hashid = jQuery.data(key,"_hashid");
        if (hashid==undefined) {
            hashid = this._shared.id++;
            jQuery.data(key,"_hashid",hashid);
        }
        this._dict[hashid] = value;
        if (this._keys!=undefined) this._keys[hashid] = key;
    }
    else if (typeof key == "object") {
        if (key._hashid == undefined) {
            key._hashid = this._shared.id++;
        }
        this._dict[key._hashid] = value;
        if (this._keys!=undefined) this._keys[key._hashid] = key;
    }
    else {
        this._dict[key] = value;
    }
    return this;
}
HashMap.prototype.get = function(key) {
    if (key instanceof Element) {
        var hashid = jQuery.data(key,"_hashid");
        return hashid == undefined ? undefined : this._dict[hashid];
    }
    else if (typeof key == "object") {
        return key._hashid == undefined ? undefined : this._dict[key._hashid];
    }
    else {
        return this._dict[key];
    }
}
HashMap.prototype.remove = function(key) {
    if (key instanceof Element) {
        var hashid = jQuery.data(key,"_hashid");
        delete this._dict[hashid];
        if (this._keys!=undefined) delete this._keys[hashid];
    }
    else if (typeof key == "object") {
        delete this._dict[key._hashid];
        if (this._keys!=undefined) delete this._keys[key._hashid];
    }
    else {
        delete this._dict[key];
    }
}
HashMap.prototype.each = function (callback) {
    if (this._keys==undefined) return;
    var keys = this._keys;
    var dict = this._dict;
    for (var hashid in keys) {
        callback(keys[hashid], dict[hashid]);
    }
}



// helper functions
function getFirstKeyInArray(data) {
    for (var prop in data)
        return prop;
}

function isDescendant(parent,child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

// uuid
var uuid = 0;
jQuery.fn.uniqueId = function () {
    return this.each(function () {
        if (!this.id) {
            this.id = "uuid-" + (++uuid);
        }
    });
};

// Plugins
var Plugins = {
    REQUIRED: "_required_argument",
    fn: {},
    use: function (elm, plugin, args, setEnabled) {
        var instances = jQuery.data(elm, "data-instances");
        if (instances == undefined)
            instances = {};
        jQuery.data(elm, "data-instances", instances);

        var pluginObj = Plugins.fn[plugin];
        if (pluginObj == undefined)
            throw "Plugin API: Plugin " + plugin + " not found.";

        // set defaults
        var pArg = {};
        for (var cArg in pluginObj.args) {
            if (args[cArg] == undefined) {
                var cArgVal = pluginObj.args[cArg];
                if (cArgVal == Plugins.REQUIRED) {
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
        var instance = instances[key];

        if (setEnabled == false && instance != undefined) { // disable
            instance.disable();
            delete instances[key];
        }
        else if (setEnabled == true && instance == undefined) { // enable
            instance = pluginObj.bind(elm)(pArg);

            if (instance != null) {
                instances[key] = instance;
                instance.enable();
            }
        }
    }
};


// Element Property Change Listener
var ElementProperty = {
    properties: new HashMap(true),
    on: function (element, property, handler) {
        // element: DOM element
        // property: css.property, height, width, outerHeight, offsetTop, ...
        // handler: function(newValue,oldValue)
        var props = this.properties.get(element);

        if (props == undefined) {
            props = {};
            this.properties.put(element, props);
        }

        if (props[property] == undefined)
            props[property] = {value: this.getProperty(element, property), listener: []};

        props[property].listener.push(handler);
    },
    off: function (element, property, handler) {
        var props = this.properties.get(element);

        if (props == undefined)
            return;
        if (props[property] == undefined)
            return;
        props[property].listener = jQuery.grep(props[property].listener, function (value) {
            return value != handler;
        });

        if (props[property].listener.length == 0)
            delete props[property];
        var size = 0;
        for (var key in props) {
            if (props.hasOwnProperty(key))
                size++;
        }
        if (size == 0)
            delete this.properties.remove(element);
    },
    fire: function (element, property, newVal, oldVal) {
        var props = this.properties.get(element);
        if (props == undefined)
            return;
        if (props[property] == undefined)
            return;
        for (var i = 0; i < props[property].listener.length; i++) {
            props[property].listener[i](newVal, oldVal);
        }
    },
    getProperty: function (element, property) {
        var p = property.split(".");

        if (p[0] == "css") { // p[1]: jQuery CSS
            return jQuery(element).css(p[1]);
        }
        else if (p[0] == "offset") { // p[1]: left + top
            return jQuery(element).offset()[p[1]];
        }
        else if (p[0] == "position") { // p[1]: left + top
            return jQuery(element).position()[p[1]];
        }
        else if (p[0] == "width") { // p[1]: undefined, inner, outer, outerWithMargin
            if (p[1] == undefined) {
                return jQuery(element).width();
            }
            else if (p[1] == "inner") {
                return jQuery(element).innerWidth();
            }
            else if (p[1] == "outer") {
                return jQuery(element).outerWidth();
            }
            else if (p[1] == "outerWithMargin") {
                return jQuery(element).outerWidth(true);
            }
        }
        else if (p[0] == "height") { // p[1]: undefined, inner, outer, outerWithMargin
            if (p[1] == undefined) {
                return jQuery(element).height();
            }
            else if (p[1] == "inner") {
                return jQuery(element).innerHeight();
            }
            else if (p[1] == "outer") {
                return jQuery(element).outerHeight();
            }
            else if (p[1] == "outerWithMargin") {
                return jQuery(element).outerHeight(true);
            }
        }
        else if (p[0] == "scroll") { // p[1]: top, left
            if (p[1] == "top") {
                return jQuery(element).scrollTop();
            }
            else if (p[1] == "left") {
                return jQuery(element).scrollLeft();
            }
        }

        return null;
    },
    check: function (element, property) { // TOOD performance / debounce events
        if (element == undefined) {
            var that = this;

            this.properties.each(function (el) {
                that.check(el, property);
            });
        }
        else {
            var props = this.properties.get(element);

            if (property == undefined && props != undefined) {
                var propList = [];
                for (var prop in props)
                    propList.push(prop);
                this.check(element, propList);
            }
            else if (props != undefined) {
                for (var i = 0; i < property.length; i++) {
                    if (props[property[i]] != undefined) {
                        var current = this.getProperty(element, property[i]);

                        if (props[property[i]].value != current) {
                            this.fire(element, property[i], current, props[property[i]].value);
                            props[property[i]].value = current;
                        }
                    }
                }
            }
        }
    },
    start: function () {
        (function (obj) {
            var observer = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var current = mutations[i].target;

                    while (current != document && current != null) {
                        obj.check(current);
                        current = current.parentNode;
                    }
                }
            });
            observer.observe(document, {attributes: true, childList: true, characterData: true, subtree: true});

            jQuery(window).on('resize', function () {
                obj.check();
            });
        })(this);
    }
};

jQuery(function () {
    ElementProperty.start();
});


// Advanced Selectors
var Selectors = {
    generate: function (selector, context) {
        var elm = $(context);

        // {this}
        if (/{parent-([0-9]+)}/g.exec(selector) != null) {
            elm.uniqueId();
            var selector = selector.replace(/{this}/g, "#" + elm.attr('id'));
        }

        // {parent-x}
        var parent_result;
        while ((parent_result = /{parent-([0-9]+)}/g.exec(selector)) != null) {
            var tmp_obj = elm;
            for (var i = 0; i < parent_result[1]; i++) {
                tmp_obj = tmp_obj.parent();
            }
            tmp_obj.uniqueId();

            var selector = selector.replace(new RegExp("{parent-" + parent_result[1] + "}"), "#" + tmp_obj.attr('id'));
        }

        // {attr-x}
        var attr_result;
        while ((attr_result = /{attr-([0-9a-zA-Z_\-]+)}/g.exec(selector)) != null) {
            var selector = selector.replace(new RegExp("{attr-" + attr_result[1] + "}"), elm.attr(attr_result[1]));
        }

        return selector;
    }
};


// Variables API // TODO checkfire langsam
var Variables = {
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
    eval: function (context, expression) { // evaluate an expression in the givne context
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

        while (current != document) {
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
            lastval: false
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
/*TODO
 * bei addVariable, on, off listener updaten
 */
        // check if listeners are set
        var listener = jQuery.data(context, "variables-listener");
        if (listener != null) {
            var fns = listener[variable];
            if (fns != null) {
                // fire listeners if neccessary
                for (var i = 0; i < fns.length; i++) {
                    var newValue = this.eval(context, fns[i].expression);

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

