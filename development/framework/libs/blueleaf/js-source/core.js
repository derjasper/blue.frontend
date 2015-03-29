// blue leaf object
var blueleaf = {
    cutomrules: {
        ruleslist: {},
        properties: {},
        enabledProperties: new HashMap(),
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
                return value !== mq+"~"+sel+"~"+index;
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
            var observer = new MutationObserver(function(mutations) { // TODO debounce
                for (var i = 0; i < mutations.length; i++) {
                    if (mutations[i].type=="attributes") {
                        traverseChildElements(mutations[i].target, function(elm) {
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
                        });
                    }
                    else if (mutations[i].type=="childList") {
                        for (var j=0; j<mutations[i].addedNodes.length; j++) {
                            
                            traverseChildElements(mutations[i].addedNodes.item(j),function(elm) {
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
                            });
                        }
                        
                        for (var j=0; j<mutations[i].removedNodes.length; j++) {
                            traverseChildElements(mutations[i].removedNodes.item(j),function(elm) {
                                var enProps = that.enabledProperties.get(elm);
                                if (enProps!=undefined) {
                                    for (var idx=0; idx<enProps.length; idx++) {
                                        var prop = enProps[idx].split("~");
                                        that.disableProperty(elm,prop[0],prop[1],prop[2]);
                                    }
                                }
                            });
                        }
                    }
                }

            });
            observer.observe(document, { attributes:true,childList:true,subtree:true });
            
            // helper function
            function traverseChildElements(elm,fn) {
                fn(elm);
                var children = elm.children;
                if (children==undefined) return;
                for (var i=0;i<children.length;i++) {
                    traverseChildElements(children[i],fn);
                }
            }
        }
    }

};

(function ($) {
    // add plugins
    for (var key in Plugins.fn) {
        (function(rule) {
            blueleaf.cutomrules.addRule(rule, {
                enable: function (elm, options) {
                    Plugins.use(elm,rule,options,true);
                },
                disable: function (elm, options) {
                    Plugins.use(elm,rule,options,false);
                }
            });
        })(key);
    }

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