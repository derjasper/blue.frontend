// TODO replace with 3rd party libs

// Map
if (Map == undefined) {
    console.log("enabling map polyfill");
    
    var LegacyMap = function () {
        this._dict = {};
        this._keys = {};
    }
    LegacyMap.prototype._shared = {id: 1};
    LegacyMap.prototype.set = function (key, value) {
        if (key.nodeType) {
            var hashid = jQuery.data(key, "_hashid");
            if (hashid == undefined) {
                hashid = this._shared.id++;
                jQuery.data(key, "_hashid", hashid);
            }
            this._dict[hashid] = value;
            this._keys[hashid] = key;
        }
        else if (typeof key == "object") {
            if (key._hashid == undefined) {
                key._hashid = this._shared.id++;
            }
            this._dict[key._hashid] = value;
            this._keys[key._hashid] = key;
        }
        else {
            this._dict[key] = value;
        }
        return this;
    }
    LegacyMap.prototype.get = function (key) {
        if (key instanceof Element) {
            var hashid = jQuery.data(key, "_hashid");
            return hashid == undefined ? undefined : this._dict[hashid];
        }
        else if (typeof key == "object") {
            return key._hashid == undefined ? undefined : this._dict[key._hashid];
        }
        else {
            return this._dict[key];
        }
    }
    LegacyMap.prototype.delete = function (key) {
        if (key instanceof Element) {
            var hashid = jQuery.data(key, "_hashid");
            delete this._dict[hashid];
            delete this._keys[hashid];
        }
        else if (typeof key == "object") {
            delete this._dict[key._hashid];
            delete this._keys[key._hashid];
        }
        else {
            delete this._dict[key];
        }
    }
    LegacyMap.prototype.forEach = function (callback) {
        var keys = this._keys;
        var dict = this._dict;
        for (var hashid in keys) {
            callback(dict[hashid], keys[hashid]);
        }
    }
    LegacyMap.prototype.has = function (key) {
        if (key instanceof Element) {
            var hashid = jQuery.data(key, "_hashid");
            return hashid == undefined ? false : this._dict[hashid] != undefined;
        }
        else if (typeof key == "object") {
            return key._hashid == undefined ? false : this._dict[key._hashid] != undefined;
        }
        else {
            return this._dict[key] != undefined;
        }
    }

    Map = LegacyMap;
}

// Element.matches
ElementPrototype = (window.Element || window.Node || window.HTMLElement).prototype;
if (ElementPrototype.matches == undefined) {
    console.log("enabling Element.matches polyfill");
    
    ElementPrototype.matches = function (selector) {
        var dom_element = this;
        var matchesSelector = dom_element.matches || dom_element.matchesSelector || dom_element.webkitMatchesSelector || dom_element.mozMatchesSelector || dom_element.msMatchesSelector || dom_element.oMatchesSelector;
        if (matchesSelector)
            return matchesSelector.call(dom_element, selector);

        var matches = (dom_element.document || dom_element.ownerDocument).querySelectorAll(selector);
        var i = 0;

        while (matches[i] && matches[i] !== dom_element) {
            i++;
        }

        return matches[i] ? true : false;
    }
}

// Set
if (Set == undefined) {
    console.log("enabling set polyfill");
    
    var LegacySet=function() {
        this.values = [];
        this.size = 0;
    }
    LegacySet.prototype.add = function(value) {
        if (this.has(value))
            return;
        this.values.push(value);
        this.size++;
    }
    LegacySet.prototype.clear = function() {
        this.values = [];
        this.size=0;
    }
    LegacySet.prototype.delete = function(value) {
        var idx = this.values.indexOf(value);
        if (idx===-1)
            return;
        this.values.splice(idx,1);
        this.size--;
    }
    LegacySet.prototype.has = function(value) {
        return this.values.indexOf(value) !== -1;
    }
    LegacySet.prototype.forEach = function(fn) {
        for (var i=0; i<this.values.length; i++) {
            fn(this.values[i]);
        }
    }
    
    Set = LegacySet;
}
"use strict";

var blue = {};

jQuery(function () {
    blue.ElementProperty.start();
});

// jQuery plugins // TODO replace (create a Plugin API?) or move into another lib
{
    var uuid = 0;
    jQuery.fn.uniqueId = function () {
        return this.each(function () {
            if (!this.id) {
                this.id = "uuid-" + (++uuid);
            }
        });
    };
}
{
    // Element Property Change Listener
    // TODO use maps and sets
    blue.ElementProperty = {
        properties: new Map(),
        on: function (element, property, handler) {
            // element: DOM element
            // property: css.property, height, width, outerHeight, offsetTop, ...
            // handler: function(newValue,oldValue)
            var props = this.properties.get(element);

            if (props == undefined) {
                props = {};
                this.properties.set(element, props);
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
                this.properties.delete(element);
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

                this.properties.forEach(function (val, el) {
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
                // TODO performance: debounce checks (Property Listener)

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
}
{
    // Plugins
    blue.Plugins = {
        REQUIRED: "_required_argument",
        fn: {},
        instances: new Map(),
        use: function (elm, plugin, args, setEnabled) { // TODO Plugins.use slow (?)
            var instances = this.instances.get(elm);
            if (instances == undefined) {
                instances = new Map();
                this.instances.set(elm, instances);
            }

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
{
    // Advanced Selectors
    blue.Selectors = {
        generate: function (selector, context) {
            var elm = $(context);

            // {this}
            if (/{this}/g.exec(selector) != null) {
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
}
{
    var nodeMap = new Map();
    
    function getVarByContext(context,name,nobinding) {
        // look in the DOM tree
        var current = context;
        
        while (current != null) {
            var node = nodeMap.get(current);
            
            if (node != undefined) {
                // look for var
                var variable = node.getVar(name);
                if (variable != undefined) {
                    return variable;
                }
                
                // look for binding
                if (!nobinding) {
                    var binding = node.bnd.get(name);
                    if (binding != undefined) {
                        return binding.variable;
                    }
                }
            }
            
            if(current == document.documentElement) {
                if (node==undefined) {
                    node = new Node(current);
                    nodeMap.set(current,node);
                }
                
                variable = new Variable("simple",false);
                node.addVar(name,variable,true);
                return variable;
            }
                
            current = current.parentNode;
        }
        
        return false;
    }
    
    // call a function on all child elements
    function traverseChildren(elm,fn) {
        if(!fn(elm))
            return;
        
        var children = elm.children;
        for (var i = 0; i < children.length; i++) {
            traverseChildren(children[i],fn);
        }
    }
    
    // parse an expression for variable names
    function getVarKeysFromExpression (expression) {
        var vars = expression.replace(/(&&|\|\||!|\(|\))/g, " ").split(" ");
        var names = [];

        for (var i = 0; i < vars.length; i++) {
            vars[i] = vars[i].trim();
            if (vars[i] !== "" && vars[i] !== "true" && vars[i] !== "false" && names.indexOf(vars[i]) == -1) {
                names.push(vars[i]);
            }
        }

        return names;
    }
    
    var Node = function(element) {
        this.var = new Map(); // variable
        this.bnd = new Map(); // binding
        this.lst = new Set(); // listener
        this.element = element; // DOM Element
    }
    Node.prototype.addVar = function(name,variable,noupdate) {
        if (this.var.has(name)) return;
        this.var.set(name,variable);
        
        // update bindings in child nodes
        if (!noupdate) {
            traverseChildren(this.element,function(elm) {
                var node = nodeMap.get(elm);
                if (node != undefined) {
                    var binding = node.bnd.get(name);
                    if (binding != undefined) {
                        binding.setVar(variable);
                        return false;
                    }
                }                
                
                return true;
            });
        }
    }
    Node.prototype.getVar = function(name) {
        return this.var.get(name);
    }
    Node.prototype.rmVar = function(name) {
        var variable = this.var.get(name);
        if (variable == undefined) return;
        
        this.var.delete(name);
        
        // assign new vars to existing bindings
        
        var newvar = getVarByContext(this.element,name);
        
        for (var i=0;i<variable.bnd.length;i++) {
            variable.bnd[i].setVar(newvar);
        }
    }
    Node.prototype.addLst = function(listener) {
        // add listener
        listener.context = this.element;
        this.lst.add(listener);
        
        // add listener to bindings
        var vars = getVarKeysFromExpression(listener.expression);
        
        for (var i = 0; i < vars.length; i++) {
            var varname = vars[i].split(".")[0];

            // get or create binding
            var binding = this.bnd.get(varname);
            if (binding == undefined) {
                var variable = getVarByContext(this.element,varname);
                binding = new Binding(variable);
                this.bnd.set(varname,binding);
            }
            
            // add listener to binding
            binding.lst.add(listener);
        }

        // update listener
        listener.update(true);
    }
    Node.prototype.rmLst = function(expr,fn) {
        var listener = null;
        
        // find listener
        this.lst.forEach(function(v) {
            if (v.expression == expr && v.fn == fn) {
                listener = v;
                return false;
            }
        });
        
        if (listener == null) return;
        
        
        // update listener to "false" for the last time
        listener.fn(false);
        
        
        // remove listener
        this.lst.delete(listener);
        
        
        // remove listener from bindings
        var vars = getVarKeysFromExpression(expr);
        for (var i = 0; i < vars.length; i++) {
            var varname = vars[i].split(".")[0];

            var binding = this.bnd.get(varname)
            if (binding != undefined) {
                binding.lst.delete(listener);
                
                // remove binding if no listeners are using it anymore
                if (binding.lst.size==0) {
                    binding.setVar(null);
                    this.bnd.delete(varname);
                }
            }
        }
    }
    Node.prototype.empty = function() {
        return this.bnd.size == 0 && this.var.size == 0 && this.lst.size == 0;
    }
    
    var Variable = function(type,value) {
        if (type == "simple") {
            this.type=0;
        }
        else if(type == "group") {
            this.type=1;
        }
        else if(type == "stack") {
            this.type=2;
        }
        
        if (this.type!=2) {
            this.value = value;
        }
        else {
            this.value = [value];
        }
        
        this.initial = value;
        
        this.bnd = new Set();
    };
    Variable.prototype.get = function(sub) {
        if (this.type == 0) {
            return this.value;
        }
        else if (this.type == 1) {
            return this.value == sub;
        }
        else {
            return this.value[this.value.length - 1] == sub;
        }
    };
    Variable.prototype.set = function(sub, value) {
        var changed = false;
        
        if (this.type == 0) {
            if (this.value != value)
                changed=true;
            this.value = value;
        }
        else if (this.type == 1) {
            if (value) {
                if (this.value != sub)
                    changed = true;
                this.value = sub;
            }
            else {
                if (this.value != this.initial)
                    changed = true;
                this.value = this.initial;
            }
        }
        else {
            if (value) {
                if (this.value[this.value.length - 1] != sub) {
                    changed = true;
                    this.value.push(sub);
                }
            }
            else {
                if (this.value[this.value.length - 1] == sub)
                    changed = true;
                
                for (var i=0;i<this.value.length;i++) {
                    if (this.value[i]==sub) {
                        this.value.splice(i,1);
                        i--;
                    }
                }
            }
        }
        
        // update if changed
        if (changed) {
            this.bnd.forEach(function(v) {
                v.update();
            });
        }
    };
    
    var Binding = function(variable) {
        this.variable = variable;
        this.variable.bnd.add(this);
        this.lst = new Set();
    }
    Binding.prototype.update = function() {
        this.lst.forEach(function(v) {
            v.update();
        });
    }
    Binding.prototype.setVar = function(variable) {
        if (this.variable != undefined) {
            this.variable.bnd.delete(this);
        }
        
        this.variable = variable;
        
        if (this.variable != null && this.variable != undefined) {
            this.variable.bnd.add(this);
            this.update();
        }
    }
    
    var Listener = function(expression,fn) {
        this.expression = expression;
        this.fn = fn;
        this.lastval = false;
        this.context;
    }
    Listener.prototype.update = function(forceUpdate) {
        var newval = blue.Variables.eval(this.context,this.expression);
        if (forceUpdate || newval != this.lastval) {
            this.fn(newval);
            this.lastval = newval;
        }
    }
    
    
    // Variables
    blue.Variables = {
        addVariable: function (elm, variable, value, type) { // type: simple, group, stack
            var node = nodeMap.get(elm);
            if (node == undefined) {
                node = new Node(elm);
                nodeMap.set(elm,node);
            }
            node.addVar(variable,new Variable(type,value));
        },
        removeVariable: function (elm, variable) {
            var node = nodeMap.get(elm);
            if (node == undefined) {
                return;
            }
            node.rmVar(variable);
            
            // remove the node if empty
            if (node.empty()) {
                nodeMap.delete(elm);
            }
        },
        get: function (context, key) {
            var k = key.split(".");
            return getVarByContext(context,k[0]).get(k[1]);
        },
        set: function (context, key, value) {
            var k = key.split(".");
            getVarByContext(context,k[0]).set(k[1],value);
        },
        eval: function(context, expression) {  // evaluate an expression in the given context
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
        on: function (context, expression, fn) { // fn: fn(value)
            var node = nodeMap.get(context);
            if (node == undefined) {
                node = new Node(context);
                nodeMap.set(context,node);
            }
            node.addLst(new Listener(expression,fn));
        },
        off: function(context, expression, fn) {
            var node = nodeMap.get(context);
            if (node == undefined) {
                return;
            }
            node.rmLst(expression,fn);
            
            // remove the node if empty
            if (node.empty()) {
                nodeMap.delete(context);
            }
        }
    };
}
(function ($,Plugins,ElementProperty) {
    Plugins.fn.container_aspectratio = function (args) {
        var elm = this;
        
        function listener () {
            if (args.adjust == "width") {
                $(elm).width($(elm).height() * args.factor);
            }
            else {
                $(elm).height($(elm).width() * args.factor);
            }
        }
        
        return {
            enable: function () {
                listener();

                if (args.adjust == "width") {
                    ElementProperty.on(elm, "height", listener);
                }
                else {
                    ElementProperty.on(elm, "width", listener);
                }
            },
            disable: function () {
                $(elm).css({width: "", height: ""});
                
                if (args.adjust == "width") {
                    ElementProperty.off(elm, "height", listener);
                }
                else {
                    ElementProperty.off(elm, "width", listener);
                }
            }
        }
    }
    
    Plugins.fn.container_aspectratio.args = {
        adjust: "width",  // adjust: "width" or "height"
        factor: Plugins.REQUIRED // float
    };
    Plugins.fn.container_aspectratio.key = [];
}(jQuery,blue.Plugins,blue.ElementProperty));
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
(function ($,Plugins) {
    Plugins.fn.grid_offset = function (args) {
        var elm = this;
        
        var offelm = $("<div />");
        
        offelm.css({
            width: args.width,
            height: args.height,
            display: 'block',
            visibility: 'hidden'
        });
        
        return {
            enable: function () {
                $(elm).before(offelm);
            },
            disable: function () {
                offelm.detach();
            }
        }
    }
    
    Plugins.fn.grid_offset.args = {
        width:Plugins.REQUIRED,
        height:Plugins.REQUIRED
    };
    Plugins.fn.grid_offset.key = [];
}(jQuery,blue.Plugins));

(function ($,Plugins) {
    var currentResizing=null;
    var mousemove=function(event) {
        if (event.which!=1) {
            $(currentResizing).removeClass($(currentResizing).data("resizable-class"));
            currentResizing=null;
            $(document).off("mousemove",mousemove);
        }
        
        if (currentResizing==null) return;
        
        if ($(currentResizing).data("resizable-moveX")!=-1)
            $(currentResizing).width(event.pageX-$(currentResizing).offset().left+$(currentResizing).data("resizable-moveX"));
        
        if ($(currentResizing).data("resizable-moveY")!=-1)
            $(currentResizing).height(event.pageY-$(currentResizing).offset().top+$(currentResizing).data("resizable-moveY"));
    }
    var mousedown=function(event) {
        if (event.which!=1) return;
        
        var distX=$(this).offset().left+$(this).width()-event.pageX;
        var distY=$(this).offset().top+$(this).height()-event.pageY;
                
        if (distX<=$(this).data("resizable-clickspacing")) $(this).data("resizable-moveX",distX);
        if (distY<=$(this).data("resizable-clickspacing")) $(this).data("resizable-moveY",distY);
        
        if ($(this).data("resizable-moveX")!=-1 || $(this).data("resizable-moveY")!=-1) {
            currentResizing=this;
            $(this).addClass($(this).data("resizable-class"));
            $(document).on("mousemove",mousemove);
        }
    }
    var mouseup=function(event) {
        $(this).data("resizable-moveX",-1);
        $(this).data("resizable-moveY",-1);
        
        currentResizing=null;
        $(this).removeClass($(this).data("resizable-class"));
        $(document).off("mousemove",mousemove);
    }
    
    Plugins.fn.resizable = function (args) {
        var elm = $(this);
        
        return {
            enable: function () {

                elm.data("resizable-clickspacing",args.click_spacing);
                elm.data("resizable-class",args.resize_class);
                elm.data("resizable-moveX",-1);
                elm.data("resizable-moveY",-1);

                elm.on("mousedown",mousedown);
                elm.on("mouseup",mouseup);
            },
            disable: function () {
                elm.off("mousedown",mousedown);
                elm.off("mouseup",mouseup);

                if (currentResizing==this) {
                    currentResizing=null;
                    $(this).removeClass($(this).data("resizable-class"));
                    $(document).off("mousemove",mousemove);
                }
            }
        }
    }
    
    Plugins.fn.resizable.args = {
        resize_class: Plugins.REQUIRED,
        click_spacing:  Plugins.REQUIRED
    };
    Plugins.fn.resizable.key = [];
}(jQuery,blue.Plugins));
(function ($,Plugins) {
    Plugins.fn.smoothscrolling = function (args) {
        var elm = this;
        
        var listener = function(event) {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var lehash=this.hash;
                if (lehash != "") {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, args.time,"swing",function() {
                            location.hash=lehash;
                        });
                        event.preventDefault();
                    }
                }
                else {
                    $('html,body').animate({
                        scrollTop: 0
                    }, args.time,"swing",function() {
                        location.hash=lehash;
                    });
                    event.preventDefault();
                }
            }
        };
        
        return {
            enable: function () {
                $(elm).on("click",listener);
            },
            disable: function () {
                $(elm).off("click",listener);
            }
        }
    }
    
    Plugins.fn.smoothscrolling.args = {
        time: 500
    };
    Plugins.fn.smoothscrolling.key = [];
}(jQuery,blue.Plugins));

(function ($,Plugins,ElementProperty) {
    Plugins.fn.sticky = function (args) {
        var rawElm = this;
        var elm = $(rawElm);
        
        var directions=args.directions;
        var scrollarea_sel=args.scrollarea_sel;
        var container_sel=args.container_sel;
        var sticky_class=args.sticky_class;
        
        if (container_sel=="_null") container_sel = null;
        // offset is determined through the element's margin with sticky_class applied.
        // z_index should be handled with CSS/SASS

        // init vars
        var container, spacer, scrollarea;
        var STATE = {OFF: 0, VIEWPORT_TOP: 1, VIEWPORT_BOTTOM: 2, PARENT_TOP: 3, PARENT_BOTTOM: 4};
        var state = STATE.OFF;
        var spacerEnabled = false;
        var element_top, element_height, parent_top, parent_height, viewport_height, viewport_top;

        // determine scrollarea
        scrollarea = elm.parent();
        if (scrollarea_sel == "viewport")
            scrollarea = $(window);
        else if (scrollarea_sel !== null)
            scrollarea = scrollarea.closest(scrollarea_sel);
        if (!scrollarea.length)
            throw "failed to find scrollarea";

        // determine container
        if (container_sel==null)
            container=null;
        else {
            container = elm.parent();
            container = container.closest(container_sel);
            if (!container.length)
                throw "failed to find container";
        }

        // init spacer
        spacer = $("<div />");

        function createSpacer () {
            if (spacerEnabled)
                return;
            spacerEnabled = true;

            spacer.css({
                width: elm.outerWidth(true),
                height: elm.outerHeight(true),
                display: elm.css("display"),
                "vertical-align": elm.css("vertical-align"),
                "float": elm.css("float"),
                'position': elm.css('position'),
                visibility: 'hidden'
            });

            elm.after(spacer);
        };

        function destroySpacer() {
            if (!spacerEnabled)
                return;
            spacerEnabled = false;

            spacer.detach();
        };

        function setElementState (s) {
            if (s === state)
                return;
            state = s;

            if (s == STATE.OFF) {
                elm.css({
                    position: "",
                    top: "",
                    width: "",
                    height: "",
                    bottom: ""
                });
                if (container!=null) container.css("position", "");

                elm.removeClass(sticky_class);
            }
            else {
                elm.addClass(sticky_class);

                if (s == STATE.VIEWPORT_TOP) {
                    elm.css({
                        position: ((scrollarea_sel == "viewport") ? "fixed" : "absolute"),
                        top: 0,
                        bottom: "",
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }
                else if (s == STATE.VIEWPORT_BOTTOM) {
                    elm.css({
                        position: ((scrollarea_sel == "viewport") ? "fixed" : "absolute"),
                        top: "",
                        bottom: 0,
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }
                else if (s == STATE.PARENT_TOP && container!=null) {
                    elm.css({
                        position: "absolute",
                        top: container.css("padding-top"),
                        bottom: "",
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }
                else if (s == STATE.PARENT_BOTTOM && container!=null) {
                    elm.css({
                        position: "absolute",
                        top: "",
                        bottom: container.css("padding-bottom"),
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }

                if (container!=null && container.css("position") === "static")
                    container.css("position", "relative");
            }
        };

        function recalc() {
            destroySpacer();
            setElementState(STATE.OFF);

            var scrolltop = scrollarea.scrollTop();
            scrollarea.scrollTop(0);

            viewport_top = ((scrollarea_sel == "viewport") ? 0 : scrollarea.offset().top + parseInt(scrollarea.css("border-top-width")) + parseInt(scrollarea.css("padding-top")));
            viewport_height = scrollarea.height();
            element_top = elm.offset().top - viewport_top;
            element_height = elm.outerHeight(true);

            if (container!=null) {
                parent_top = container.offset().top + parseInt(container.css("border-top-width")) + parseInt(container.css("padding-top"));
                parent_height = container.height();
            }
            else {
                parent_top=null;
                parent_height=null;
            }

            elm.addClass(sticky_class);
            element_top -= parseInt(elm.css("margin-top"));
            element_height += parseInt(elm.css("margin-top")) + parseInt(elm.css("margin-bottom"));
            elm.removeClass(sticky_class);

            scrollarea.scrollTop(scrolltop);

            tick();
        };

        function tick () {
            var scroll = scrollarea.scrollTop();

            if (scroll > element_top && directions.top) {
                if (container!=null && scroll + element_height > parent_top + parent_height) {
                    createSpacer();
                    setElementState(STATE.PARENT_BOTTOM);
                }
                else {
                    createSpacer();
                    setElementState(STATE.VIEWPORT_TOP);
                    if (scrollarea_sel != "viewport") {
                        elm.css("top", scroll);
                    }
                }
            }
            else if (scroll + viewport_height < element_top + element_height && directions.bottom) {
                if (container!=null && scroll + viewport_height < parent_top + element_height) {
                    createSpacer();
                    setElementState(STATE.PARENT_TOP);
                }
                else {
                    createSpacer();
                    setElementState(STATE.VIEWPORT_BOTTOM);
                    if (scrollarea_sel != "viewport") {
                        elm.css("top", viewport_height - element_height + scroll);
                    }
                }
            }
            else {
                destroySpacer();
                setElementState(STATE.OFF);
            }
        };
        
        return {
            enable: function () {
                recalc();

                scrollarea.on("touchmove", tick);
                scrollarea.on("scroll", tick);
                
                if (scrollarea_sel == "viewport") {
                    $(window).on("resize", recalc);
                }
                else {
                    ElementProperty.on(scrollarea,"width",recalc);
                    ElementProperty.on(scrollarea,"height",recalc);
                }
            },
            disable: function () {
                scrollarea.off("scroll", tick);
                scrollarea.off("touchmove", tick);

                if (scrollarea_sel == "viewport") {
                    $(window).off("resize", recalc);
                }
                else {
                    ElementProperty.off(scrollarea,"width",recalc);
                    ElementProperty.off(scrollarea,"height",recalc);
                }

                setElementState(STATE.OFF);
                destroySpacer();
                spacer.remove();
            }
        }
    }
    
    Plugins.fn.sticky.args = {
        directions: {top:true,bottom:false},
        scrollarea_sel: "viewport",
        container_sel: null,
        sticky_class: "sticky"
    };
    Plugins.fn.sticky.key = [];
}(jQuery,blue.Plugins,blue.ElementProperty));
(function ($,Plugins) {
    Plugins.fn.stickyfooter = function (args) {
        var elm = $(this);
        
        // determine parent
        var parent = elm.parent();
        if (args.scrollarea != null)
            parent = parent.closest(args.scrollarea);
        if (!parent.length)
            throw "Stickyfooter: failed to find scroll area";

        function setElementState(s) {
            if (s == false) {
                elm.css({
                    position: "",
                    bottom: "",
                    width: "",
                    height: "",
                });
                parent.css("position", "");
            }
            else {
                setElementState(false);

                elm.css({
                    position: "absolute",
                    bottom: 0,
                    width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                    height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                });

                if (parent.css("position") === "static")
                    parent.css("position", "relative");
            }
        };

        function recalc () {
            parent.css("height", "auto");
            parent.css("min-height", "0");
            var contentheight = parent.height();
            parent.css("height", "");
            parent.css("min-height", "");

            if (contentheight < parent.height()) {
                setElementState(true);
            }
            else {
                setElementState(false);
            }
        };

        return {
            enable: function () {
                recalc();
                $(window).on("resize", recalc);
            },
            disable: function () {
                $(window).off("resize", recalc);
                setElementState(false);
            }
        }
    }
    
    Plugins.fn.stickyfooter.args = {
        scrollarea: null
    };
    Plugins.fn.stickyfooter.key = [];
}(jQuery,blue.Plugins));
(function ($,Plugins,Variables,Selectors) {
    var trigger_actions=new Object();
    
    // TODO delegated trigger (API addition)
    
    $(document).on("click mouseover mouseout",function(event) {
        var eventID=event.target.id+"-"+event.type;
                        
        if (trigger_actions[eventID]!=undefined) {            
            for (var i=0;i<trigger_actions[eventID].length;i++) {
                var a = trigger_actions[eventID][i];
                
                var val=Variables.eval(a.context,a.value_expression);
                for (var j=0;j<a.keyList.length;j++) {
                    Variables.set(a.context,a.keyList[j],val);
                }
                
            }
            
            delete trigger_actions[eventID];
        }
    });
    
    var handleEvent = function(context,keyList,value_expression,priority,eventID) {
        if (trigger_actions[eventID]==undefined) trigger_actions[eventID] = new Array();
        
        var new_obj={
            keyList:keyList,
            value_expression:value_expression,
            priority:priority,
            context:context
        };        
        
        trigger_actions[eventID].push({key:"trololol"});
        
        for (var i=trigger_actions[eventID].length-1; i>=0; i--) {
            if (i!=0 && new_obj.priority<trigger_actions[eventID][i-1].priority) {
                trigger_actions[eventID][i]=trigger_actions[eventID][i-1];
            }
            else {
                trigger_actions[eventID][i]=new_obj;
                break;
            }
        }
    }
    
    Plugins.fn.trigger = function (args) {
        var elm = this;
                
        // process key
        var keyList = args.key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }

        // process expression
        args.value_expression = Selectors.generate(args.value_expression,elm);

        var listener = function(event) {
            if (args.event_type=="focus" || args.event_type=="blur") {
                var val=Variables.eval(elm,args.value_expression);
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],val);
                }
                return true;
            }
            handleEvent(elm,keyList,args.value_expression,args.priority,event.target.id+"-"+event.type);
            return true;
        }
        
        return {
            enable: function () {
                $(elm).on(args.event_type,listener);
            },
            disable: function () {
                $(elm).off(args.event_type,listener);
            }
        }
    }
    Plugins.fn.trigger.args = {
        key: Plugins.REQUIRED,
        event_type: "click", // event_type: click, mouseover, mouseout, focus, blur
        value_expression: "true",
        priority: 0
    };
    Plugins.fn.trigger.key = ["key","event_type","value_expression","priority"];
    
    
    Plugins.fn.trigger_bind = function (args) {
        var elm = this;
        
        $(elm).uniqueId();

        var keyList = args.key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }

        var data = {
            listener_on: function() {
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],true);
                }
                return true;
            },
            listener_off: function() {
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],false);
                }
                return true;
            }
        };
        
        
        return {
            enable: function () {
                if (args.status_type=="hover") {
                    $(elm).on("mouseover",data.listener_on);
                    $(elm).on("mouseout",data.listener_off);
                }
                else if (args.status_type=="focus") {
                    $(elm).on("focus",data.listener_on);
                    $(elm).on("blur",data.listener_off);
                }
            },
            disable: function () {
                if (args.status_type=="hover") {
                    $(elm).off("mouseover",data.listener_on);
                    $(elm).off("mouseout",data.listener_off);
                }
                else if (args.status_type=="focus") {
                    $(elm).off("focus",data.listener_on);
                    $(elm).off("blur",data.listener_off);
                }
            }
        }
    }
    Plugins.fn.trigger_bind.args = {
        key: Plugins.REQUIRED,
        status_type: "hover" // status_type: hover, focus
    };
    Plugins.fn.trigger_bind.key = ["key","status_type"];
    
    
    Plugins.fn.trigger_bind_scrollposition = function (args) { 
        var elm = this;
        
        // preprocess key
        var keyList = args.key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }
        
        var d_offset = {top:0,right:0,bottom:0,left:0};
        jQuery.extend(d_offset,args.offset);
        var status = false;
        var scrollarea_elm = (args.scrollarea=="window") ? $(window) : $(Selectors.generate(args.scrollarea,elm));

        var listener = function() {
            var scrollTop = scrollarea_elm.scrollTop();
            var scrollLeft = scrollarea_elm.scrollLeft();
            var width = scrollarea_elm.innerWidth();
            var height = scrollarea_elm.innerHeight();
            var containerTop = (args.scrollarea=="window") ? 0 : scrollarea_elm.offset().top + parseInt(scrollarea_elm.css("border-top-width")) + parseInt(scrollarea_elm.css("padding-top"));
            var containerLeft = (args.scrollarea=="window") ? 0 : scrollarea_elm.offset().left + parseInt(scrollarea_elm.css("border-left-width")) + parseInt(scrollarea_elm.css("padding-left"));

            var elmOff = $(elm).offset();
            if (args.scrollarea!="window") elmOff.top+=scrollTop-containerTop;
            if (args.scrollarea!="window") elmOff.left+=scrollLeft-containerLeft;
            var elmWidth = $(elm).outerWidth();
            var elmHeight = $(elm).outerHeight();

            var currentStatus={};

            if (args.scroll_status=="top" || args.scroll_status=="visible")
                currentStatus.top = (scrollTop+d_offset.top >= elmOff.top-1);

            if (args.scroll_status=="bottom" || args.scroll_status=="visible")
                currentStatus.bottom=(scrollTop+height-d_offset.bottom <= elmOff.top+elmHeight+1);

            if (args.scroll_status=="left" || args.scroll_status=="visible")
                currentStatus.left=(scrollLeft+d_offset.left >= elmOff.left-1);

            if (args.scroll_status=="right" || args.scroll_status=="visible")
                currentStatus.right=(scrollLeft+width-d_offset.right <= elmOff.left+elmWidth+1);

            if (args.scroll_status=="visible")
                currentStatus.visible= !currentStatus.top && !currentStatus.bottom && !currentStatus.left && !currentStatus.right;

            if (currentStatus[args.scroll_status] != status) {
                status = currentStatus[args.scroll_status];
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],status);
                }
            }
        };
        
        return {
            enable: function () {
                scrollarea_elm.on("touchmove", listener);
                scrollarea_elm.on("scroll", listener);
                scrollarea_elm.on("resize", listener);
                
                listener();
            },
            disable: function () {
                scrollarea_elm.off("touchmove", listener);
                scrollarea_elm.off("scroll", listener);
                scrollarea_elm.off("resize", listener);  
                
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],false);
                }
            }
        }
    }
    Plugins.fn.trigger_bind_scrollposition.args = {
        key: Plugins.REQUIRED,
        scroll_status: "top", // scroll_status: visible, top, bottom, left, right
        scrollarea: "window",
        offset: {} // offset: {top:,right:,bottom:,left:}
    };
    Plugins.fn.trigger_bind_scrollposition.key = ["key"];
}(jQuery,blue.Plugins,blue.Variables,blue.Selectors));
(function ($,Plugins,Selectors,Variables) {
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
}(jQuery,blue.Plugins,blue.Selectors,blue.Variables));
var CSSParser;

{
    CSSParser = {};

    CSSParser.parse = function parse(css) {
        var tree = new Object();

        var currentId = "";
        var openBrackets = [];
        var comment = false;

        var pos = 0;
        while (pos < css.length) {
            if (!comment && css[pos] == "/") {
                var match = /^\/\*! customrule: ({(?:(?!\*\/).)*}) \*\//g.exec(css.substring(pos));

                if (match != null) {
                    pos += match.index + match[0].length;

                    var mediaQuery = '';
                    var selector = '';

                    for (var i = 0; i < openBrackets.length; i++) {
                        if (openBrackets[i].indexOf("@media") === 0) {
                            var str = openBrackets[i].substring(6).trim();

                            if (mediaQuery == "")
                                mediaQuery = str;
                        }
                        else if (openBrackets[i].indexOf("@") === -1) {
                            selector = openBrackets[i];
                        }
                    }

                    if (mediaQuery == "") {
                        mediaQuery = "all";
                    }

                    if (selector == "")
                        return null;

                    var json;
                    try {
                        json = JSON.parse(match[1])
                    }
                    catch (e) {
                        return null;
                    }

                    if (tree[mediaQuery] == undefined)
                        tree[mediaQuery] = {};
                    if (tree[mediaQuery][selector] == undefined)
                        tree[mediaQuery][selector] = [];

                    tree[mediaQuery][selector].push(json);

                    continue;
                }
            }

            if (!comment) {
                if (css[pos] == "{") {
                    openBrackets.push(currentId.trim());
                    currentId = "";
                }
                else if (css[pos] == "}") {
                    openBrackets.pop();
                    currentId = "";
                }
                else if (css[pos] == ";") {
                    currentId = "";
                }
                else if (css[pos] == "/" && pos + 1 < css.length && css[pos + 1] == "*") {
                    comment = true;
                    currentId = "";
                }
                else {
                    currentId += css[pos];
                }
            }
            else {
                if (css[pos] == "*" && pos + 1 < css.length && css[pos + 1] == "/") {
                    comment = false;
                }
            }

            pos++;
        }

        if (openBrackets.length != 0)
            return null;

        return tree;
    };
}
// blue leaf object
// TODO use maps and sets
var blueleaf = {
    customrules: {
        properties: {}, // TODO use map
        enabledSelectors: new Map(),
        addProperty: function (mq, sel, rule, options) {
            if (this.properties[mq] == undefined)
                this.properties[mq] = {
                    selectors: {},
                    active: false
                };

            if (this.properties[mq].selectors[sel] == undefined)
                this.properties[mq].selectors[sel] = new Array();

            this.properties[mq].selectors[sel].push({
                rule: rule,
                options: options
            });
        },
        addProperties: function (tree) {
            for (var mq in tree) {
                for (var sel in tree[mq]) {
                    for (var i = 0; i < tree[mq][sel].length; i++) {
                        for (var cl in tree[mq][sel][i])
                            this.addProperty(mq, sel, cl, tree[mq][sel][i][cl]);
                    }
                }
            }
        },
        enableSelector: function (elm, mq, sel) {
            var enProps = this.enabledSelectors.get(elm);
            if (enProps == undefined) { // TODO use set
                enProps = {};
                this.enabledSelectors.set(elm, enProps);
            }
            if (enProps[mq + "~" + sel] == true)
                return;
            enProps[mq + "~" + sel] = true;

            var rules = this.properties[mq].selectors[sel];

            for (var i = 0; i < rules.length; i++) {
                blue.Plugins.use(elm, rules[i].rule, rules[i].options, true);
            }
        },
        disableSelector: function (elm, mq, sel) {
            var enProps = this.enabledSelectors.get(elm);

            if (enProps == undefined)
                return;
            if (enProps[mq + "~" + sel] == undefined)
                return;
            delete enProps[mq + "~" + sel];

            var rules = this.properties[mq].selectors[sel];

            for (var i = 0; i < rules.length; i++) {
                blue.Plugins.use(elm, rules[i].rule, rules[i].options, false);
            }

        },
        apply: function () { // re-applys custom rules (if you need this, it's a bug)
            for (var mq in this.properties) {
                var properties = this.properties[mq];
                var mql = window.matchMedia(mq);

                if (mql.matches) {
                    properties.active = true;

                    for (var sel in properties.selectors) {
                        var lst = document.querySelectorAll(sel);
                        for (var n = 0; n < lst.length; n++) {
                            this.enableSelector(lst[n], mq, sel);
                        }
                    }
                }
                else {
                    properties.active = false;

                    for (var sel in properties.selectors) {
                        var lst = document.querySelectorAll(sel);
                        for (var n = 0; n < lst.length; n++) {
                            this.disableSelector(lst[n], mq, sel);
                        }
                    }
                }
            }
        },
        init: function () {
            for (var mq in this.properties) {
                (function (mq1, properties, that) {
                    var mql = window.matchMedia(mq1);

                    if (mql.matches) { // apply instantly
                        properties.active = true;

                        for (var sel in properties.selectors) {
                            var lst = document.querySelectorAll(sel);
                            for (var n = 0; n < lst.length; n++) {
                                that.enableSelector(lst[n], mq1, sel);
                            }
                        }
                    }

                    mql.addListener(function (mql) { // add listener to mediaquery
                        if (mql.matches) {
                            properties.active = true;

                            for (var sel in properties.selectors) {
                                var lst = document.querySelectorAll(sel);
                                for (var n = 0; n < lst.length; n++) {
                                    that.enableSelector(lst[n], mq1, sel);
                                }
                            }
                        }
                        else {
                            properties.active = false;

                            for (var sel in properties.selectors) {
                                var lst = document.querySelectorAll(sel);
                                for (var n = 0; n < lst.length; n++) {
                                    that.disableSelector(lst[n], mq1, sel);
                                }
                            }
                        }
                    });
                })(mq, this.properties[mq], this);
            }

            var that = this;

            var changes = [];
            function pushChange(elm, type) { // 0:addAll,1:removeAll,2:update
                var length = changes.length;
                for (var i = 0; i < length; i++) {
                    if (changes[i].elm == elm) {
                        if (changes[i].type != type && changes[i].type == 2) {
                            changes[i].type = type;
                            return;
                        }
                    }
                    else if (isDescendant(changes[i].elm, elm)) {
                        if (changes[i].type != type && changes[i].type == 2) {
                            changes.push({elm: elm, type: type, exclude: new Set()});
                            changes[i].exclude.add(elm);
                        }
                        return;
                    }
                    else if (isDescendant(elm, changes[i].elm)) {
                        if (changes[i].type != type && type == 2) {
                            changes.push(changes[i]);
                            changes[i] = {elm: elm, type: type, exclude: new Set()};
                            changes[i].exclude.add(changes[i].elm);
                        }
                        else {
                            changes[i] = {elm: elm, type: type, exclude: new Set()};
                        }
                        return;
                    }
                }
                changes.push({elm: elm, type: type, exclude: new Set()});
            }
            function processChanges() {
                for (var i = 0; i < changes.length; i++) {
                    var c = changes[i];

                    if (c.elm.querySelectorAll == undefined)
                        continue;

                    if (c.type == 0) { // addAll                        
                        for (var mq in that.properties) {
                            if (that.properties[mq].active == true) {
                                for (var sel in that.properties[mq].selectors) {
                                    var lst = c.elm.querySelectorAll(sel);
                                    for (var n = 0; n < lst.length; n++) {
                                        if (!c.exclude.has(lst[n])) {
                                            that.enableSelector(lst[n], mq, sel);
                                        }
                                    }

                                    if (c.elm.matches(sel)) {
                                        that.enableSelector(c.elm, mq, sel);
                                    }
                                }
                            }
                        }
                    }
                    else if (changes[i].type == 1) { // removeAll
                        traverseChildElements(c.elm, function (elm) {
                            var enProps = that.enabledSelectors.get(elm);
                            if (enProps != undefined) {
                                for (var key in enProps) {
                                    var prop = key.split("~");
                                    that.disableSelector(elm, prop[0], prop[1]);
                                }
                            }
                            return true;
                        });
                    }
                    else { // update
                        // remove invalid rules
                        traverseChildElements(c.elm, function (elm) {
                            var enProps = that.enabledSelectors.get(elm);
                            if (enProps != undefined) {
                                for (var key in enProps) {
                                    var prop = key.split("~");
                                    if (!elm.matches(prop[1])) {
                                        that.disableSelector(elm, prop[0], prop[1]);
                                    }
                                }
                            }
                        });

                        // add new rules
                        for (var mq in that.properties) {
                            if (that.properties[mq].active == true) {
                                for (var sel in that.properties[mq].selectors) {
                                    var lst = c.elm.querySelectorAll(sel);
                                    for (var n = 0; n < lst.length; n++) {
                                        that.enableSelector(lst[n], mq, sel);
                                    }

                                    if (c.elm.matches(sel)) {
                                        that.enableSelector(c.elm, mq, sel);
                                    }
                                }
                            }
                        }
                    }
                }

                changes = [];
            }
            var _timeout;

            var observer = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    if (mutations[i].type == "attributes") {
                        pushChange(mutations[i].target, 2);
                    }
                    else if (mutations[i].type == "childList") {
                        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                            pushChange(mutations[i].addedNodes.item(j), 0);
                        }
                        for (var j = 0; j < mutations[i].removedNodes.length; j++) {
                            pushChange(mutations[i].removedNodes.item(j), 1);
                        }
                    }
                }

                if (!!_timeout) {
                    clearTimeout(_timeout);
                }
                _timeout = setTimeout(function () {
                    processChanges();
                }, 50);
            });
            observer.observe(document, {attributes: true, childList: true, subtree: true});

            // helper functions
            function traverseChildElements(elm, fn) {
                fn(elm);
                var children = elm.children;
                if (children == undefined)
                    return;
                for (var i = 0; i < children.length; i++) {
                    if (traverseChildElements(children[i], fn) == false)
                        return;
                }
            }
            function isDescendant(parent, child) {
                var node = child.parentNode;
                while (node != null) {
                    if (node == parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            }
        }
    }

};
(function () {
    // get JSON data from CSS, and enable media querys
    jQuery(function () {
        function getStyleSheets() {
            var links = document.getElementsByTagName('link');
            var stylesheets = [];

            for (var i = 0; i < links.length; i++) {
                if (links[i].rel.match(/stylesheet/)) {
                    stylesheets.push(links[i].href);
                }
            }

            return stylesheets;
        }

        var stylesheets = getStyleSheets();
        var loaded = 0;
        function init() {
            loaded++;
            if (loaded == stylesheets.length)
                blueleaf.customrules.init();
        }
        for (var i = 0; i < stylesheets.length; i++) {
            jQuery.get(stylesheets[i], null, function (data) {
                if (data.indexOf("/*! blueleaf */") === 0) {
                    var tree = CSSParser.parse(data);
                    if (tree != null) {
                        blueleaf.customrules.addProperties(tree);
                    }
                }

                init();
            });
        }
    });
}());