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
    
    
    // TODO sticky anpassen an APIs und enable/disable
/*
    // Sticky
    blueleaf.cutomrules.addRule("sticky", {
        match: function (sel, options) {
            $(sel).sticky_enable({
                parent: options.parent,
                stick_in: options.stick_in,
                z_index: options.zindex,
                stick_directions: options.directions,
                sticky_class: options.sticked_class,
                scrollarea_offset: options.scrollarea_offset
            });
        },
        unmatch: function (sel, options) {
            $(sel).sticky_disable();
        }
    });
    

    
*/

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