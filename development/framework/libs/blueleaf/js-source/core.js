// TODO auf memory leaks testen

// blue leaf object
var blueleaf = {
    cutomrules: {
        properties: {},
        enabledSelectors: new Map(),
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
        enableSelector: function(elm,mq,sel) {
            var enProps = this.enabledSelectors.get(elm);
            if (enProps==undefined) {
                enProps={};
                this.enabledSelectors.set(elm,enProps);
            }
            if (enProps[mq+"~"+sel]==true) return;
            enProps[mq+"~"+sel]=true;
            
            var rules = this.properties[mq].selectors[sel];
            
            for (var i=0; i< rules.length; i++) {
                Plugins.use(elm, rules[i].rule, rules[i].options, true);
            }
        },
        disableSelector: function(elm,mq,sel) {
            var enProps = this.enabledSelectors.get(elm);
            
            if (enProps==undefined) return;
            if (enProps[mq+"~"+sel]==undefined) return;
            delete enProps[mq+"~"+sel];
            
            var rules = this.properties[mq].selectors[sel];
            
            for (var i=0; i< rules.length; i++) {
                Plugins.use(elm, rules[i].rule, rules[i].options, false);
            }
            
        },
        apply: function () { // re-applys custom rules (if you need this, it's a bug)
            for (var key in enquire.queries) {
                enquire.queries[key].assess();
            }
        },
        init: function() {
            for(var mq in this.properties) {
                (function (mq1, properties, that) {
                    enquire.register(mq1, {
                        match: function () {
                            properties.active=true;
                            
                            for (var sel in properties.selectors) {
                                var lst = document.querySelectorAll(sel);
                                for (var n=0; n<lst.length; n++) {
                                    that.enableSelector(lst[n],mq1,sel);
                                }
                            }
                        },
                        unmatch: function () {
                            properties.active=false;
                            
                            for (var sel in properties.selectors) {
                                var lst = document.querySelectorAll(sel);
                                for (var n=0; n<lst.length; n++) {
                                    that.disableSelector(lst[n],mq1,sel);
                                }
                            }
                        }
                    });
                })(mq, this.properties[mq], this);
            }
            
            var that = this;
            
            var changes=[];
            function pushChange(elm,type) { // 0:addAll,1:removeAll,2:update
                var length = changes.length;
                for (var i=0;i<length; i++) {
                    if (changes[i].elm==elm) {
                        if (changes[i].type!=type && changes[i].type==2) {
                            changes[i].type=type;
                            return;
                        }
                    }
                    else if (isDescendant(changes[i].elm,elm)) {
                        if (changes[i].type!=type && changes[i].type==2) {
                            changes.push({elm:elm,type:type,exclude:[]});
                            changes[i].exclude.push(elm);
                        }
                        return;
                    }
                    else if (isDescendant(elm,changes[i].elm)) {
                        if (changes[i].type!=type && type==2) {
                            changes.push(changes[i]);
                            changes[i]={elm:elm,type:type,exclude:[changes[i].elm]};
                        }
                        else {
                            changes[i]={elm:elm,type:type,exclude:[]};
                        }
                        return;
                    }
                }
                changes.push({elm:elm,type:type,exclude:[]});
            }
            function processChanges() {
                for (var i=0;i<changes.length; i++) {
                    var c = changes[i];
                    
                    if (c.elm.querySelectorAll == undefined) continue;
                    
                    if (c.type==0) { // addAll                        
                        for(var mq in that.properties) {
                            if (that.properties[mq].active==true) {
                                for (var sel in that.properties[mq].selectors) { // TODO ggf maps benutzen ...
                                    var lst = c.elm.querySelectorAll(sel);
                                    for (var n=0; n<lst.length; n++) {
                                        if (jQuery.inArray(lst[n],c.exclude)==-1) { // TODO ggf set benutzen ...
                                            that.enableSelector(lst[n],mq,sel);
                                        }
                                    }
                                    
                                    if (matchesSelector(c.elm,sel)) {
                                        that.enableSelector(c.elm,mq,sel);
                                    }
                                }
                            }
                        }
                    }
                    else if (changes[i].type==1) { // removeAll
                        traverseChildElements(c.elm,function(elm) {
                            var enProps = that.enabledSelectors.get(elm);
                            if (enProps!=undefined) {
                                for (var key in enProps) {
                                    var prop = key.split("~");
                                    that.disableSelector(elm,prop[0],prop[1]);
                                }
                            }
                            return true;
                        });
                    }
                    else { // update
                        // remove invalid rules
                        traverseChildElements(c.elm, function(elm) {
                            var enProps = that.enabledSelectors.get(elm);
                            if (enProps!=undefined) {
                                for (var key in enProps) {
                                    var prop = key.split("~");
                                    if (!matchesSelector(elm,prop[1])) {
                                        that.disableSelector(elm,prop[0],prop[1]);
                                    }
                                }
                            }
                        });
                        
                        // add new rules
                        for(var mq in that.properties) {
                            if (that.properties[mq].active==true) {
                                for (var sel in that.properties[mq].selectors) {
                                    var lst = c.elm.querySelectorAll(sel);
                                    for (var n=0; n<lst.length; n++) {
                                        that.enableSelector(lst[n],mq,sel);
                                    }
                                    
                                    if (matchesSelector(c.elm,sel)) {
                                        that.enableSelector(c.elm,mq,sel);
                                    }
                                }
                            }
                        }
                    }
                }
                
                changes=[];
            }
            var _timeout;
            
            var observer = new MutationObserver(function(mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    if (mutations[i].type=="attributes") {
                        pushChange(mutations[i].target,2);
                    }
                    else if (mutations[i].type=="childList") {
                        for (var j=0; j<mutations[i].addedNodes.length; j++) {
                            pushChange(mutations[i].addedNodes.item(j),0);
                        }
                        for (var j=0; j<mutations[i].removedNodes.length; j++) {
                            pushChange(mutations[i].removedNodes.item(j),1);
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
            observer.observe(document, { attributes:true,childList:true,subtree:true });
            
            // helper function
            function traverseChildElements(elm,fn) {
                fn(elm);
                var children = elm.children;
                if (children==undefined) return;
                for (var i=0;i<children.length;i++) {
                    if (traverseChildElements(children[i],fn)==false) return;
                }
            }
        }
    }

};

(function ($) {
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