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


// helper functions
function getFirstKeyInArray(data) {
    for (var prop in data)
        return prop;
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
var Plugins = function (elm) {
    return new Plugins.init(elm);
};
Plugins.fn = {};
Plugins.init = function (elm) {
    this.elm = elm;
}
Plugins.init.prototype = Plugins.fn;


// Element Property Change Listener
var ElementProperty = {
    properties: new Map(), // TODO jquery data verwenden und parallel liste mit DOMElements (?) [ggf direkt in map so machen???]
    on: function (element, property, handler) {
        // element: DOM element
        // property: css.property, height, width, outerHeight, offsetTop, ...
        // handler: function(newValue,oldValue)
        var props=this.properties.get(element);
        
        if (props == undefined) {
            props={};
            this.properties.put(element,props);
        }
        
        if (props[property] == undefined)
            props[property] = {value: this.getProperty(element, property), listener: []};
                
        props[property].listener.push(handler);
    },
    off: function (element, property, handler) {
        var props=this.properties.get(element);
        
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
        var props=this.properties.get(element);
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
    check: function (element, property) { // TOOD performance
        if (element == undefined) {
            var that=this;
            
            this.properties.each(function(el) {
                that.check(el, property);
            });
        }
        else {
            var props=this.properties.get(element);
            
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
    generate: function(selector, context) {
        var elm = $(context);
        elm.uniqueId();
        
        // {this}
        var selector=selector.replace(/{this}/g, "#"+elm.attr('id'));

        // {parent-x}
        var parent_result;
        while((parent_result = /{parent-([0-9]+)}/g.exec(selector))!=null) {
            var tmp_obj=$("#"+elm.attr('id'));
            for (var i=0; i<parent_result[1]; i++) {
                tmp_obj=tmp_obj.parent();
            }
            tmp_obj.uniqueId();

            var selector=selector.replace(new RegExp("{parent-"+parent_result[1]+"}"), "#"+tmp_obj.attr('id'));          
        }

        // {attr-x}
        var attr_result;
        while((attr_result = /{attr-([0-9a-zA-Z_\-]+)}/g.exec(selector))!=null) {
            var selector=selector.replace(new RegExp("{attr-"+attr_result[1]+"}"), elm.attr(attr_result[1]));          
        }
        
        return selector;
    }
};


// Variables API
var Variables = {
    addVariable: function(elm,variable,value,type) { // type: simple, group, stack
        var vars = jQuery.data(elm,"variables");
        if (vars==null) {
            vars = {};
            jQuery.data(elm,"variables",vars);
        }
        
        if (type=="simple") {
            vars[variable]={initial: value, value: value, type: type};
        }
        else if (type=="group") {
            vars[variable]={initial: value, value: value, type: type};
        }
        else {
            vars[variable]={initial: value, value: [value], type: type};
        }
        
        this.checkfire(elm,variable);
    },
    removeVariable: function(elm,variable) {
        var vars = jQuery.data(elm,"variables");
        if (vars==null) {
            return;
        }
        delete vars[variable];
        
        this.checkfire(elm,variable);
    },
    getVariable: function(elm,variable) { // get a directly attached variable
        var vars = jQuery.data(elm,"variables");
        
        if (vars==null) 
            return undefined;
        
        return vars[variable];
    },
    setVariable: function(elm,key,value) { // set a directly attached variable
        var k = key.split(".");
        
        var variable = this.getVariable(elm,k[0]);
        
        if (variable==undefined) {
            if (elm==document.documentElement) {
                this.addVariable(elm,key,value,"simple");
                variable = this.getVariable(elm,key);
            }
            else {
                return false;
            }
        }
        
        this.setVal(variable,k[1],value);
        
        this.checkfire(elm,k[0]);
        
        return true;
    },
    getVal: function (variable, sub) { // process a variables value
        if (variable.type=="simple") {
            return variable.value;
        }
        else if (variable.type=="group") {
            return variable.value==sub;
        }
        else {
            return variable.value[variable.value.length-1]==sub;
        }
    },
    setVal: function (variable, sub, value) { // process the input to a variable value
        if (variable.type=="simple") {
            variable.value=value;
        }
        else if (variable.type=="group") {
            if (value) {
                variable.value=sub;
            }
            else {
                variable.value=variable.initial;
            }
        }
        else {
            if (value) {
                if (variable.value[variable.value.length-1]!=sub)
                    variable.value.push(sub);
            }
            else {
                variable.value=jQuery.grep(variable.value, function(value) {
                    return value != sub;
                });
            }
        }
    },
    get: function(context,key) { // get a variable in the current context
        var current = context;
        var k = key.split(".");
        
        while (current!=document) {
            var val;
            if ((val=this.getVariable(current,k[0]))!=undefined) 
                return this.getVal(val,k[1]);
            
            current = current.parentNode;
        }
        return false;
    },
    _expr_get_var_paths: function(expression) {
        var vars = expression.replace(/(&&|\|\||!|\(|\))/g," ").split(" ");
        var names = [];
        
        for (var i=0;i<vars.length;i++) {
            vars[i]=vars[i].trim();
            if (vars[i]!=="" && vars[i]!=="true" && vars[i]!=="false" && jQuery.inArray(vars[i], names)==-1) {
                names.push(vars[i]);
            }
        }
        
        return names;
    },
    eval: function(context,expression) { // evaluate an expression in the givne context
        // supported: (,),&&,||,!,true,false and variables
       
        var re = /[^(&&|\|\||!|\(|\))]+(?=(|&&|\|\||!|\(|\)))/g;
        var offset = 0;
        var matches=[];
        var match;
        while ((match = re.exec(expression)) != null) {
            matches.push(match);
        }
        for (var i=0;i<matches.length;i++) {
            if (matches[i][0]==="true" || matches[i][0]==="false") continue;
            
            var value=this.get(context,matches[i][0])+"";
            
            expression=expression.substring(0,matches[i].index+offset) + value + expression.substring(matches[i].index+offset+matches[i][0].length,expression.length); 
            offset+=value.length-matches[i][0].length;
        }
        
        return eval(expression);
    },
    set: function(context,key,value) { // set a variable
        var current = context;
        
        while (current!=document) {
            if (this.setVariable(current,key,value))
                return;
            
            current = current.parentNode;
        }
    },
    on: function(context,expression,fn) { // fn: fn(value)
        var lstnr = jQuery.data(context,"variables-listener");
        if (lstnr==null) {
            lstnr = {};
            jQuery.data(context,"variables-listener",lstnr);
        }
        
        var listener = {
            expression: expression,
            fn: fn,
            lastval: false
        };
        
        var vars = this._expr_get_var_paths(expression);
        
        for (var i=0;i<vars.length; i++) {
            var varname = vars[i].split(".")[0];
            
            var temp = lstnr[varname];
            if(temp==undefined) {
                temp = [];
                lstnr[varname] = temp;
            }
            
            temp.push(listener);
        }
        
        listener.last=this.eval(context,expression);
        fn(listener.last);
    },
    off: function(context,expression,fn) {
        var lstnr = jQuery.data(context,"variables-listener");
        if (lstnr==null) {
            return;
        }
                
        var vars = this._expr_get_var_paths(expression);
        
        for (var i=0;i<vars.length; i++) {
            var varname = vars[i].split(".")[0];
            
            if(lstnr[varname]==undefined) {
                return;
            }
            
            lstnr[varname]=jQuery.grep(lstnr[varname],function(val) {
                return val.expression!=expression && val.fn!=fn;
            });
        }
        
        if (this.eval(context,expression)) {
            fn(false);
        }
    },
    checkfire: function (context,variable) { // check and fire listeners if necessary
        // check if listeners are set
        var listener = jQuery.data(context,"variables-listener");
        if (listener!=null) {
            var fns = listener[variable];
            if (fns!=null) {
                // fire listeners if neccessary
                for (var i=0;i<fns.length;i++) {
                    var newValue = this.eval(context,fns[i].expression);
                    
                    if (fns[i].last!=newValue) {
                        fns[i].last=newValue;
                        fns[i].fn(newValue);
                    }
                }
            }
        }
        
        // propagate changes to children
        var children = context.children;
        for (var i=0; i<children.length; i++) {
            if (this.getVariable(children[i],variable)==undefined) {
                this.checkfire(children[i],variable);
            }
        }
    }
};


(function ($) {
    Plugins.fn.container_aspectratio = function (adjust, factor) { // adjust: "width" or "height"; factor: float
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("container-aspectratio"))
                    return;

                $(elm).data("container-aspectratio", {
                    listener: function () {
                        if (adjust == "width") {
                            $(elm).width($(elm).height() * factor);
                        }
                        else {
                            $(elm).height($(elm).width() * factor);
                        }
                    }
                }
                );
                $(elm).data("container-aspectratio").listener();

                if (adjust == "width") {
                    ElementProperty.on(elm, "height", $(elm).data("container-aspectratio").listener);
                }
                else {
                    ElementProperty.on(elm, "width", $(elm).data("container-aspectratio").listener);
                }
            },
            disable: function () {
                if (!$(elm).data("container-aspectratio"))
                    return;

                $(elm).css({width: "", height: ""});

                if (adjust == "width") {
                    ElementProperty.off(elm, "height", $(elm).data("container-aspectratio").listener);
                }
                else {
                    ElementProperty.off(elm, "width", $(elm).data("container-aspectratio").listener);
                }

                $(elm).removeData("container-aspectratio");
            }
        }
    }
}(jQuery));
(function ($) { 
    Plugins.fn.expressionlistener_class = function (element_class,expression) {
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
                                
                Variables.off(elm,expression,listener);
            }
        }
    }
}(jQuery));
(function ($) {
    Plugins.fn.grid_offset = function (width, height) {
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("grid-row-offset-offelm")) {
                    $(elm).data("grid-row-offset-offelm").css({
                        width: width,
                        height: height,
                        display: 'block',
                        visibility: 'hidden'
                    });
                }
                else {
                    var offelm = $("<div />");

                    offelm.css({
                        width: width,
                        height: height,
                        display: 'block',
                        visibility: 'hidden'
                    });

                    $(elm).before(offelm);

                    $(elm).data("grid-row-offset-offelm", offelm);
                }
            },
            disable: function () {
                if (!elm.data("grid-row-offset-offelm"))
                    return;

                $(elm).data("grid-row-offset-offelm").detach();

                $(elm).removeData("grid-row-offset-offelm");
            }
        }
    }
}(jQuery));
(function ($) {
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
    
    Plugins.fn.resizable = function (resize_class, click_spacing) {
        var elm = $(this.elm);
        return {
            enable: function () {
                if (elm.data("resizable-enabled")) return;
                elm.data("resizable-enabled",true);

                elm.data("resizable-clickspacing",click_spacing);
                elm.data("resizable-class", resize_class);
                elm.data("resizable-moveX",-1);
                elm.data("resizable-moveY",-1);

                elm.on("mousedown",mousedown);
                elm.on("mouseup",mouseup);
            },
            disable: function () {
                if (!elm.data("resizable-enabled")) return;
                elm.removeData("resizable-enabled");

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
}(jQuery));
(function ($) {
    Plugins.fn.smoothscrolling = function (time) {
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("smoothscrolling")!=undefined) return;
                
                var listener = function(event) {
                    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                        var lehash=this.hash;
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                        if (target.length) {
                            console.log(target.offset().top);
                            $('html,body').animate({
                                scrollTop: target.offset().top
                            }, time,"swing",function() {
                                location.hash=lehash;
                            });
                            event.preventDefault();
                        }
                        else if(this.hash=="") {
                            $('html,body').animate({
                                scrollTop: 0
                            }, time,"swing",function() {
                                location.hash=lehash;
                            });
                            event.preventDefault();
                        }
                    }
                };
                
                $(elm).data("smoothscrolling",listener);
                $(elm).on("click",listener);
            },
            disable: function () {
                var listener = $(elm).data("smoothscrolling")
                if (listener==undefined) return;
                $(elm).off("click",listener);
                $(elm).removeData("smoothscrolling");
            }
        }
    }
}(jQuery));
// TODO docs
(function ($) {
    Plugins.fn.sticky = function (directions, scrollarea_sel, container_sel, sticky_class) {
        var rawElm = this.elm;
        var elm = $(rawElm);
        return {
            enable: function () {
                if ($.data(rawElm,"sticky")!=undefined) return;
                
                // default values
                directions = directions || {top:true,bottom:false};
                scrollarea_sel = scrollarea_sel || "viewport";
                container_sel = container_sel || null; if (container_sel=="_null") container_sel = null;
                sticky_class = sticky_class || "sticky";
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

                function detach () {
                    scrollarea.off("scroll", tick);
                    scrollarea.off("touchmove", tick);
                    $(window).off("resize", recalc);

                    setElementState(STATE.OFF);
                    destroySpacer();
                    spacer.remove();
                };

                recalc();

                scrollarea.on("touchmove", tick);
                scrollarea.on("scroll", tick);
                $(window).on("resize", recalc);
                // TODO listen to DOM mutations / use Element Property Listener; save less variables in recalc
                
                $.data(rawElm,"sticky",detach);

            },
            disable: function () {
                var detach = $.data(rawElm,"sticky");
                if (detach==undefined) return;
                detach();
            }
        }
    }
}(jQuery));
(function ($) {
    Plugins.fn.stickyfooter = function (scrollarea) {
        var elm = $(this.elm);

        return {
            enable: function () {
                if (elm.data("stickyfooter")!=undefined)
                    return;
                
                // determine parent
                var parent = elm.parent();
                if (scrollarea != undefined)
                    parent = parent.closest(scrollarea);
                if (!parent.length)
                    throw "Stickyfooter: failed to find parent";

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

                function detach() {
                    if (!elm.data("stickyfooter_enabled"))
                        return;
                    elm.removeData("stickyfooter_enabled");

                    $(window).off("resize", recalc);
                    elm.off("sticky_detach", detach);

                    setElementState(false);
                };

                recalc();

                $(window).on("resize", recalc);
                
                $(elm).data("stickyfooter", detach);
            },
            disable: function () {
                var detach = $(elm).data("stickyfooter");
                if (detach==undefined) return;
                
                detach();
            }
        }
    }
}(jQuery));


(function ($) {
    var trigger_actions=new Object();
    
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
    
    
    Plugins.fn.trigger = function (key,event_type,value_expression,priority) {
        // event_type: click, mouseover, mouseout, focus, blur
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("trigger-"+key+"-"+event_type)!=undefined) return;
                
                $(elm).uniqueId();
                
                // process key
                var keyList = key.split(",");
                for (var i=0;i<keyList.length;i++) {
                    keyList[i] = Selectors.generate(keyList[i],elm);
                }
                
                // process expression
                value_expression = Selectors.generate(value_expression,elm);

                var listener = function(event) {
                    if (event_type=="focus" || event_type=="blur") {
                        var val=Variables.eval(elm,value_expression);
                        for (var i=0;i<keyList.length;i++) {
                            Variables.set(elm,keyList[i],val);
                        }
                        return true;
                    }
                    handleEvent(elm,keyList,value_expression,priority,event.target.id+"-"+event.type);
                    return true;
                }
                
                $(elm).data("trigger-"+key+"-"+event_type,listener);

                $(elm).on(event_type,listener);
            },
            disable: function () {
                if ($(elm).data("trigger-"+key+"-"+event_type) == undefined) return;

                $(elm).off(event_type,$(elm).data("trigger-"+key+"-"+event_type));
                
                $(elm).removeData("trigger-"+key+"-"+event_type);
            }
        }
    }
    
    
    Plugins.fn.trigger_bind = function (key,status_type) {
        // status_type: hover, focus
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("trigger-bind-"+key+"-"+status_type)!=undefined) return;
                
                $(elm).uniqueId();

                var keyList = key.split(",");
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
                
                $(elm).data("trigger-bind-"+key+"-"+status_type,data);

                if (status_type=="hover") {
                    $(elm).on("mouseover",data.listener_on);
                    $(elm).on("mouseout",data.listener_off);
                }
                else if (status_type=="focus") {
                    $(elm).on("focus",data.listener_on);
                    $(elm).on("blur",data.listener_off);
                }
            },
            disable: function () {
                var data = (elm).data("trigger-bind-"+key+"-"+status_type);
                if (data == undefined) return;

                if (status_type=="hover") {
                    $(elm).off("mouseover",data.listener_on);
                    $(elm).off("mouseout",data.listener_off);
                }
                else if (status_type=="focus") {
                    $(elm).off("focus",data.listener_on);
                    $(elm).off("blur",data.listener_off);
                }
                
                $(elm).removeData("trigger-bind-"+key+"-"+status_type);
            }
        }
    }
    
    
    Plugins.fn.trigger_bind_scrollposition = function (key,scroll_status,scrollarea,offset) { // scroll_status: visible, top, bottom, left, right; offset: {top:,right:,bottom:,left:}
        var elm = this.elm;
        
        // preprocess key
        var keyList = key.split(",");
        for (var i=0;i<keyList.length;i++) {
            keyList[i] = Selectors.generate(keyList[i],elm);
        }
        
        return {
            enable: function () {
                if (jQuery.data(elm,"trigger-bind-scrollposition-"+key)!=undefined) return;
                
                var d_offset = {top:0,right:0,bottom:0,left:0};
                jQuery.extend(d_offset,offset);
                var status = false;
                var scrollarea_elm = (scrollarea=="window") ? $(window) : $(Selectors.generate(scrollarea,elm));
                                                                
                var data = {
                    listener: function() {
                        var scrollTop = scrollarea_elm.scrollTop();
                        var scrollLeft = scrollarea_elm.scrollLeft();
                        var width = scrollarea_elm.innerWidth();
                        var height = scrollarea_elm.innerHeight();
                        var containerTop = (scrollarea=="window") ? 0 : scrollarea_elm.offset().top + parseInt(scrollarea_elm.css("border-top-width")) + parseInt(scrollarea_elm.css("padding-top"));
                        var containerLeft = (scrollarea=="window") ? 0 : scrollarea_elm.offset().left + parseInt(scrollarea_elm.css("border-left-width")) + parseInt(scrollarea_elm.css("padding-left"));

                        var elmOff = $(elm).offset();
                        if (scrollarea!="window") elmOff.top+=scrollTop-containerTop;
                        if (scrollarea!="window") elmOff.left+=scrollLeft-containerLeft;
                        var elmWidth = $(elm).outerWidth();
                        var elmHeight = $(elm).outerHeight();
                        
                        var currentStatus={};
                        
                        if (scroll_status=="top" || scroll_status=="visible")
                            currentStatus.top = (scrollTop+d_offset.top >= elmOff.top-1);
                        
                        if (scroll_status=="bottom" || scroll_status=="visible")
                            currentStatus.bottom=(scrollTop+height-d_offset.bottom <= elmOff.top+elmHeight+1);
                        
                        if (scroll_status=="left" || scroll_status=="visible")
                            currentStatus.left=(scrollLeft+d_offset.left >= elmOff.left-1);
                        
                        if (scroll_status=="right" || scroll_status=="visible")
                            currentStatus.right=(scrollLeft+width-d_offset.right <= elmOff.left+elmWidth+1);
                            
                        if (scroll_status=="visible")
                            currentStatus.visible= !currentStatus.top && !currentStatus.bottom && !currentStatus.left && !currentStatus.right;
                                                              
                        if (currentStatus[scroll_status] != status) {
                            status = currentStatus[scroll_status];
                            for (var i=0;i<keyList.length;i++) {
                                Variables.set(elm,keyList[i],status);
                            }
                        }
                    },
                    scrollarea_elm: scrollarea_elm
                };
                
                jQuery.data(elm,"trigger-bind-scrollposition-"+key,data);

                data.scrollarea_elm.on("touchmove", data.listener);
                data.scrollarea_elm.on("scroll", data.listener);
                data.scrollarea_elm.on("resize", data.listener);
                
                data.listener();
            },
            disable: function () {
                var data = jQuery.data(elm,"trigger-bind-scrollposition-"+key);
                if (data==undefined) return;
                
                data.scrollarea_elm.off("touchmove", data.listener);
                data.scrollarea_elm.off("scroll", data.listener);
                data.scrollarea_elm.off("resize", data.listener);  
                
                for (var i=0;i<keyList.length;i++) {
                    Variables.set(elm,keyList[i],false);
                }
                
                jQuery.removeData(elm,"trigger-bind-scrollposition-"+key);
            }
        }
    }
}(jQuery));
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
function CSSParser (css) {
    this.css=css;
    this.token={
        'ENABLE': /\/\*! blueleaf \*\//,
        
        'SELECTOR': /^([^{}@\/]+)(?={)/,
        'MEDIA_DIRECTIVE': /^@media ([^{}\/]+)(?={)/,
        'IGNORE': /^@[^{}@\/]+(?={)/,
        
        'BLOCK_OPEN': /^{/,
        'BLOCK_CLOSE': /^}/,
        'BLOCK_CONTENT': /^((\/\*[^]*\*\/|[^{}])*)/, 
                
        'COMMENT_OPEN':/^\/\*/,
        'COMMENT_CLOSE': /^\*\//,
        'COMMENT_CONTENT': /^((?!\*\/)[^])+/,
        
        'RULE': /^([^\/{}:;\n]+:[^{}:;\n]+;)/,
        
        'COMMENT_CONTENT_JSON_DATA': /^! customrule: /
    };
    this.position=0;
    this.tree=new Object();
    this.error=false;
    
    this.currentMediaQuery='all';
    this.currentSelector='';
}

CSSParser.prototype.requireToken = function(tokens) {
    if (!(tokens instanceof Array)) tokens=new Array(tokens);
        
    var skip=/^[\s\n]*/;
    var match1=skip.exec(this.css.substring(this.position));
    if (match1 != null) {
        this.position+=match1.index+match1[0].length;
    }
        
    for (var i=0;i<tokens.length;i++) {
        var match = this.token[tokens[i]].exec(this.css.substring(this.position));
        
        if (match != null) {
            this.position+=match.index+match[0].length;
            
            return {
                type: tokens[i],
                match: match
            };
        }
    }
    
    return null;
};
 
CSSParser.prototype.parse = function() {
    function parseBlockContent(that) {
        var current;
        
        while((current=that.requireToken(['RULE', 'COMMENT_OPEN']))!=null) {
            if (current.type=='COMMENT_OPEN') {
                if (that.requireToken('COMMENT_CONTENT_JSON_DATA')!=null) {
                    var res=that.requireToken('COMMENT_CONTENT');
                    if (res!=null) {
                        var obj = JSON.parse(res.match[0]);
                        
                        if (that.tree[that.currentMediaQuery]==undefined)
                            that.tree[that.currentMediaQuery]=new Object();
                        
                        if (that.tree[that.currentMediaQuery][that.currentSelector]==undefined) {
                            that.tree[that.currentMediaQuery][that.currentSelector]=new Array();
                        }
                        
                        that.tree[that.currentMediaQuery][that.currentSelector].push(obj);
                    }
                }
                that.requireToken('COMMENT_CONTENT');
                if (that.requireToken('COMMENT_CLOSE')==null) {that.error=true; return false;}
            }
        }
                
        return true;
    }
    
    function requireBlockContentXT(that) {
        var current;
        
        while((current=that.requireToken(['SELECTOR','IGNORE','BLOCK_CONTENT']))!=null) {
            if (current.type=='BLOCK_CONTENT') {return true;}
            
            if (that.requireToken('BLOCK_OPEN')==null) {return false;}
            if (!requireBlockContentXT(that)) {return false;}
            if (that.requireToken('BLOCK_CLOSE')==null) {return false;}
        }
                
        return true;
    }
    
    if (this.requireToken('ENABLE')==null) {
        return false;
    }
    
    var current;
    while((current=this.requireToken(['SELECTOR','MEDIA_DIRECTIVE', 'IGNORE', 'COMMENT_OPEN']))!=null) {
        if (current.type=='SELECTOR') {
            this.currentSelector=current.match[1];
            if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
            if (parseBlockContent(this)==false) {return false;}
            if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
            this.currentSelector='';
        }
        else if (current.type=='MEDIA_DIRECTIVE') {
            this.currentMediaQuery=current.match[1];
            if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}

            var current2;
            while((current2=this.requireToken(['SELECTOR', 'IGNORE', 'COMMENT_OPEN']))!=null) {
                if (current2.type=='SELECTOR') {
                    this.currentSelector=current2.match[1];
                    if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
                    if (parseBlockContent(this)==false) {return false;}
                    if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
                    this.currentSelector='';
                }
                else if (current2.type=='IGNORE') {
                    if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
                    if (!requireBlockContentXT(this)) {this.error=true; return false;}
                    if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
                }
                else if (current2.type=='COMMENT_OPEN') {
                    if (this.requireToken('COMMENT_CONTENT')==null) {this.error=true; return false;}
                    if (this.requireToken('COMMENT_CLOSE')==null) {this.error=true; return false;}
                }
            }
            
            if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
            this.currentMediaQuery='all';
        }
        else if (current.type=='IGNORE') {
            if (this.requireToken('BLOCK_OPEN')==null) {this.error=true; return false;}
            if (!requireBlockContentXT(this)) {this.error=true; return false;}
            if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
        }
        else if (current.type=='COMMENT_OPEN') {
            if (this.requireToken('COMMENT_CONTENT')==null) {this.error=true; return false;}
            if (this.requireToken('COMMENT_CLOSE')==null) {this.error=true; return false;}
        }
    }
    
    return true;
};


// blue leaf object
var blueleaf = {
    cutomrules: {
        ruleslist: {},
        properties: {},
        enabledProperties: new Map(),
        addRule: function (rule, options) { // options: enable(sel,options) + disable(sel,options)
            this.ruleslist[rule] = options;
        },
        addProperty: function(mq,sel,rule,options) {
            if (this.properties[mq]==undefined) this.properties[mq]= {
                selectors: {},
                active: false
            };
            
            if (this.properties[mq].selectors[sel]==undefined)
                this.properties[mq].selectors[sel]=new Array();
            
            this.properties[mq].selectors[sel].push({
                rule: rule,
                options: options
            });
        },
        parseStyleSheet: function (css) {
            var parser = new CSSParser(css);
            if (!parser.parse())
                return;

            for (var mq in parser.tree) {
                for (var sel in parser.tree[mq]) {
                    for (var i = 0; i < parser.tree[mq][sel].length; i++) {
                        var cl = getFirstKeyInArray(parser.tree[mq][sel][i]);
                        this.addProperty(mq,sel,cl, parser.tree[mq][sel][i][cl]);
                    }
                }
            }
        },
        enableProperty: function(elm,mq,sel,index) {
            var enProps = this.enabledProperties.get(elm);
            if (enProps==undefined) {
                enProps=[];
                this.enabledProperties.put(elm,enProps);
            }
            if (jQuery.inArray(mq+"~"+sel+"~"+index, enProps) > -1) return;
            if (this.ruleslist[this.properties[mq].selectors[sel][index].rule] == undefined) return;
                
            this.ruleslist[this.properties[mq].selectors[sel][index].rule].enable(elm, this.properties[mq].selectors[sel][index].options);
            
            enProps.push(mq+"~"+sel+"~"+index);
        },
        disableProperty: function(elm,mq,sel,index) {
            var enProps = this.enabledProperties.get(elm);
            
            if (enProps==undefined) return;
            if (jQuery.inArray(mq+"~"+sel+"~"+index, enProps) == -1) return;
            if (this.ruleslist[this.properties[mq].selectors[sel][index].rule] == undefined) return;
                
            this.ruleslist[this.properties[mq].selectors[sel][index].rule].disable(elm, this.properties[mq].selectors[sel][index].options);
            
            this.enabledProperties.put(elm,jQuery.grep(enProps, function(value) {
                return value != mq+"~"+sel+"~"+index;
            }));
        },
        apply: function () { // re-applys custom rules (if you need this, it's a bug)
            for (var key in enquire.queries) {
                enquire.queries[key].assess();
            }
        },
        init: function() {
            for(var mq in this.properties) {
                (function (mq1, properties, ruleslist, that) {
                    enquire.register(mq1, {
                        match: function () {
                            properties.active=true;
                            
                            for (var sel in properties.selectors) {
                                for (var i=0; i<properties.selectors[sel].length; i++) {
                                    if (ruleslist[properties.selectors[sel][i].rule] != undefined) {
                                        jQuery(sel).each(function() {
                                            that.enableProperty(this,mq1,sel,i);
                                        });
                                    }
                                        
                                }
                            }
                        },
                        unmatch: function () {
                            properties.active=false;
                            
                            for (var sel in properties.selectors) {
                                for (var i=0; i<properties.selectors[sel].length; i++) {
                                    if (ruleslist[properties.selectors[sel][i].rule] != undefined) {
                                        jQuery(sel).each(function() {
                                            that.disableProperty(this,mq1,sel,i);
                                        });
                                    }
                                }
                            }
                        }
                    });
                })(mq, this.properties[mq], this.ruleslist, this);
            }
            
            var that = this;
            var observer = new MutationObserver(function(mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    if (mutations[i].type=="attributes") {
                        var elm = mutations[i].target;
                        var active = [];
                        for(var mq in that.properties) {
                            if (that.properties[mq].active==true) {
                                for (var sel in that.properties[mq].selectors) {
                                    if (jQuery(elm).is(sel)) {
                                        for (var idx=0; idx<that.properties[mq].selectors[sel].length; idx++) {
                                            that.enableProperty(elm,mq,sel,idx);
                                            active.push(mq+"~"+sel+"~"+idx);
                                        }
                                    }
                                }
                            }
                        }
                        var enProps = that.enabledProperties.get(elm);
                        if (enProps!=undefined) {
                            for (var j=0;j<enProps.length;j++) {
                                if (jQuery.inArray(enProps[j], active) == -1) {
                                    var prop = enProps[j].split("~");
                                    that.disableProperty(elm,prop[0],prop[1],prop[2]);
                                }
                            }
                        }
                    }
                    else if (mutations[i].type=="childList") {
                        for (var j=0; j<mutations[i].addedNodes.length; j++) {
                            var elm = mutations[i].addedNodes.item(j);
                            for(var mq in that.properties) {
                                if (that.properties[mq].active==true) {
                                    for (var sel in that.properties[mq].selectors) {
                                        if (jQuery(elm).is(sel)) {
                                            for (var idx=0; idx<that.properties[mq].selectors[sel].length; idx++) {
                                                that.enableProperty(elm,mq,sel,idx);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        for (var j=0; j<mutations[i].removedNodes.length; j++) {
                            var elm = mutations[i].removedNodes.item(j);
                            var enProps = that.enabledProperties.get(elm);
                            if (enProps!=undefined) {
                                for (var idx=0; idx<enProps.length; idx++) {
                                    var prop = enProps[idx].split("~");
                                    that.disableProperty(elm,prop[0],prop[1],prop[2]);
                                }
                            }
                        }
                    }
                }

            });
            observer.observe(document, { attributes:true,childList:true,subtree:true });
        }
    }

};

(function ($) {
    // Container
    blueleaf.cutomrules.addRule("container-aspectratio", {
        enable: function (elm, options) {
            Plugins(elm).container_aspectratio(options.adjust, options.factor).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).container_aspectratio().disable();
        }
    });
    
    // Grid
    blueleaf.cutomrules.addRule("grid-offset", {
        enable: function (elm, options) {
            Plugins(elm).grid_offset(options.width, options.height).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).grid_offset().disable();
        }
    });
    
    // Resizeable
    blueleaf.cutomrules.addRule("resizable", {
        enable: function (elm, options) {
            Plugins(elm).resizable(options.resize_class, options.click_spacing).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).resizable().disable();
        }
    });
    
    // Variables
    blueleaf.cutomrules.addRule("variable_init", {
        enable: function (elm, options) {
            Plugins(elm).variable_init(options.variable,options.value,options.type).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).variable_init(options.variable).disable();
        }
    });
    
    // Expressionlistener
    blueleaf.cutomrules.addRule("expressionlistener_class", {
        enable: function (elm, options) {
            Plugins(elm).expressionlistener_class(options.element_class,options.expression).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).expressionlistener_class(options.element_class).disable();
        }
    });
    
    blueleaf.cutomrules.addRule("expressionlistener_focus", {
        enable: function (elm, options) {
            Plugins(elm).expressionlistener_focus(options.expression).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).expressionlistener_focus(options.expression).disable();
        }
    });
    
    blueleaf.cutomrules.addRule("expressionlistener_set", {
        enable: function (elm, options) {
            Plugins(elm).expressionlistener_set(options.expression,options.key,options.value_expression).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).expressionlistener_set(options.expression,options.key).disable();
        }
    });
    
    // Trigger
    blueleaf.cutomrules.addRule("trigger", {
        enable: function (elm, options) {
            Plugins(elm).trigger(options.key,options.event_type,options.value_expression,options.priority).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).trigger(options.key,options.event_type).disable();
        }
    });
    
    blueleaf.cutomrules.addRule("trigger_bind", {
        enable: function (elm, options) {
            Plugins(elm).trigger_bind(options.key,options.status_type).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).trigger_bind(options.key,options.status_type).disable();
        }
    });
    
    blueleaf.cutomrules.addRule("trigger_bind_scrollposition", {
        enable: function (elm, options) {
            Plugins(elm).trigger_bind_scrollposition(options.key,options.scroll_status,options.scrollarea,options.offset).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).trigger_bind_scrollposition(options.key).disable();
        }
    });
    
    // Smoothscrolling
    blueleaf.cutomrules.addRule("smoothscrolling", {
        enable: function (elm, options) {
            Plugins(elm).smoothscrolling(options.time).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).smoothscrolling().disable();
        }
    });
    
    // Stickfooter
    blueleaf.cutomrules.addRule("stickyfooter", {
        enable: function (elm, options) {
            Plugins(elm).stickyfooter(options.parent).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).stickyfooter(options.parent).disable();
        }
    });
    
    // Sticky
    blueleaf.cutomrules.addRule("sticky", {
        enable: function (elm, options) {
            Plugins(elm).sticky(options.directions, options.scrollarea_sel, options.container_sel, options.sticky_class).enable();
        },
        disable: function (elm, options) {
            Plugins(elm).sticky().disable();
        }
    });

    // get JSON data from CSS, and enable media querys
    $(function () {
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
        var loaded=0;
        function init() {
            loaded++;
            if (loaded==stylesheets.length) blueleaf.cutomrules.init();
        }
        for (var i = 0; i < stylesheets.length; i++) {
            jQuery.get(stylesheets[i], null, function (data) {
                blueleaf.cutomrules.parseStyleSheet(data);
                init();
            });
        }
    });
}(jQuery));