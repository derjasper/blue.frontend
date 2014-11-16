// helper functions
function getFirstKeyInArray(data) {
  for (var prop in data) return prop;
}

var uuid = 0;
$.fn.uniqueId = function() {
    return this.each(function() {
        if (!this.id) {
            this.id = "uuid-" + (++uuid);
        }
    });
};

// blue leaf object
var blueleaf = {
    scrollarea: {
        offset: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        changeOffset: function(newoffset) {
            if (newoffset.top==null) newoffset.top=0;
            if (newoffset.right==null) newoffset.right=0;
            if (newoffset.bottom==null) newoffset.bottom=0;
            if (newoffset.left==null) newoffset.left=0;
            this.offset.top+=newoffset.top;
            this.offset.right+=newoffset.right;
            this.offset.bottom+=newoffset.bottom;
            this.offset.left+=newoffset.left;
        }
    },
    apply: function() { // to be called when changes to the DOM are made
        for(var key in enquire.queries){
            enquire.queries[key].assess();
        }  
    },
    cutomrules: {
        ruleslist: {},
        registerModuleQuery: function (rule,options) { // options: match(sel,options) + unmatch(sel,options)
            this.ruleslist[rule]=options;
        },
        parseStyleSheet: function (css) {
            var parser = new CSSParser(css);
            if (!parser.parse()) return;

            for (var mq in parser.tree) {
                for (var sel in parser.tree[mq]) {
                    for (var i=0;i<parser.tree[mq][sel].length;i++) {
                        var cl=getFirstKeyInArray(parser.tree[mq][sel][i]);
                        (function(mq1,sel1,cl1,tree1,ruleslist){
                            enquire.register(mq1, {
                                match: function() {
                                    if (ruleslist[cl1]!=undefined)
                                        ruleslist[cl1]['match'](sel1,tree1);
                                },
                                unmatch: function() {
                                    if (ruleslist[cl1]!=undefined)
                                        ruleslist[cl1]['unmatch'](sel1,tree1);
                                }
                            });
                        })(mq,sel,cl,parser.tree[mq][sel][i][cl],this.ruleslist);
                    }
                }
            }
        }
    }
    
};

(function($){
    
    // Sticky
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("sticky", {
            match: function(sel,options) {
                $(sel).sticky_enable({
                    parent:options.parent,
                    z_index: options.zindex,
                    stick_directions:options.directions,
                    sticky_class:options.sticked_class,
                    scrollarea_offset:options.scrollarea_offset
                });
            },
            unmatch: function(sel,options) {
                $(sel).sticky_disable();
            }
        });
    });
    
    // Trigger
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("trigger", {
            match: function(sel,options) {
                $(sel).trigger_enable(options.type,options.target_expr,options.trigger_class,options.trigger_mode,options.priority);
            },
            unmatch: function(sel,options) {
                $(sel).trigger_enable(options.type,options.target_expr,options.trigger_class,options.trigger_mode,options.priority);
            }
        });
    });
    
    // Triggered
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("triggered", {
            match: function(sel,options) {
                $(sel).trigger_set(options.trigger_class,"on");
            },
            unmatch: function(sel,options) {
                $(sel).trigger_set(options.trigger_class,"off");
            }
        });
    });
    
    // Scrollposition
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("scrollposition", {
            match: function(sel,options) {
                $(sel).scrollposition_enable(options.target,options.group,options.scrolled_class);
            },
            unmatch: function(sel,options) {
                $(sel).scrollposition_disable(options.target,options.group);
            }
        });
    });
    
    // Smoothscrolling
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("smoothscrolling", {
            match: function(sel,options) {
                $(sel).smoothscrolling_enable(options.time);
            },
            unmatch: function(sel,options) {
                $(sel).smoothscrolling_disable();
            }
        });
    });
    
    // Scrollareaoffset
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("scrollareaoffset", {
            match: function(sel,options) {
                $(sel).scrollareaoffset_enable(options.offset);
            },
            unmatch: function(sel,options) {
                $(sel).scrollareaoffset_disable();
            }
        });
    });
    
    // Resizeable
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("resizable", {
            match: function(sel,options) {
                $(sel).resizable_enable(options.resize_class,options.click_spacing);
            },
            unmatch: function(sel,options) {
                $(sel).resizable_disable();
            }
        });
    });
    
    // Stickfooter
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("stickyfooter", {
            match: function(sel,options) {
                $(sel).stickyfooter_enable(options.parent);
            },
            unmatch: function(sel,options) {
                $(sel).stickyfooter_disable();
            }
        });
    });
    
    // Grid
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("grid-offset", {
            match: function(sel,options) {
                $(sel).grid_offset_enable(options.width,options.height);
            },
            unmatch: function(sel,options) {
                $(sel).grid_offset_disable();
            }
        });
    });
    
    
    // get JSON data from CSS, and enable media querys
    $(function() {
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
        
        var stylesheets=getStyleSheets();
        for (var i=0; i<stylesheets.length; i++) {
            jQuery.get(stylesheets[i], null, function(data) {
                blueleaf.cutomrules.parseStyleSheet(data);
            });
        }
    });
    
    
    // listen for DOM changes and apply handler
    /*
    $(function() {
        var observer = new MutationObserver(function(mutations) {
            // TODO make sure that DOM mutation is not caused by blueleaf (otherwise there is an endless loop)
            console.log("mutation observed");
            blueleaf.apply(); 
        });
        observer.observe(document, { attributes:true,childList:true,characterData:true,subtree:true });
    });
    */
}(jQuery));