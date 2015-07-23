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
            
            current = current.parentNode;
        }
        
        return null;
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
        
        // assign new var to existing bindings
        var newvar = getVarByContext(this.element,name);
                        
        for (var i=0;i<variable.bnd.length;i++) {
            // newvar == null: this is an inconsistent state. the binding does nothing; either waits for an variable or will be deleted soon.
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
                
                // variable == null: this is an inconsistent state. the binding does nothing; either waits for an variable or will be deleted soon.
                
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
        
        if (variable != null)
            this.variable.bnd.add(this);
        
        this.lst = new Set();
    }
    Binding.prototype.update = function() {
        this.lst.forEach(function(v) {
            v.update();
        });
    }
    Binding.prototype.setVar = function(variable) {
        if (this.variable != null && this.variable != undefined) {
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
            var variable = getVarByContext(context,k[0]);
            if (variable == null) return false;
            return variable.get(k[1]);
        },
        set: function (context, key, value) {
            var k = key.split(".");
            var variable = getVarByContext(context,k[0]);
            if (variable!=null) variable.set(k[1],value);
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