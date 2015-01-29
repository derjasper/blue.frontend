(function($) {
    $.fn.container_aspectratio_enable = function(adjust,factor) { // adjust: "width" or "height"; factor: float
        _fn = function(elm) {
            if (elm.data("container-aspectratio-enabled")) return;
            elm.data("container-aspectratio-enabled",true);
            
            elm.data("container-aspectratio-listener",function() {
                if (adjust=="width") {
                    elm.width(elm.height()*factor);
                }
                else {
                    elm.height(elm.width()*factor);
                }
            });
            
            elm.data("container-aspectratio-listener")();
            
            $(window).on('resize',elm.data("container-aspectratio-listener"));
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
    
    
    $.fn.container_aspectratio_disable = function() {
        _fn = function(elm) {
            if (!elm.data("container-aspectratio-enabled")) return;
            
            elm.css({width:"",height:""});
            
            $(window).off('resize',elm.data("container-aspectratio-listener"));
            elm.removeData("container-aspectratio-listener");
            
            elm.removeData("container-aspectratio-enabled");
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
}(jQuery));
function CSSParser (css) {
    this.css=css;
    this.token={
        'ENABLE': /\/\*! blueleaf \*\//,
        
        'SELECTOR': /^([^{}@\/]+)/,
        'MEDIA_DIRECTIVE': /^@media ([^{}\/]+)/,
        'IGNORE': /^@[^{}@\/]+/,
        
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
                    if (this.requireToken('BLOCK_CONTENT')==null) {this.error=true; return false;}
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
            if (this.requireToken('BLOCK_CONTENT')==null) {this.error=true; return false;}
            if (this.requireToken('BLOCK_CLOSE')==null) {this.error=true; return false;}
        }
        else if (current.type=='COMMENT_OPEN') {
            if (this.requireToken('COMMENT_CONTENT')==null) {this.error=true; return false;}
            if (this.requireToken('COMMENT_CLOSE')==null) {this.error=true; return false;}
        }
    }
    
    return true;
};


(function($) {
    $.fn.grid_offset_enable = function(width,height) {        
        _fn = function(elm) {
            if (elm.data("grid-row-offset-offelm")) {
                elm.data("grid-row-offset-offelm").css({
                    width: width,
                    height: height,
                    display: 'block',
                    visibility:'hidden'
                });
            }
            else {
                var offelm = $("<div />");
                
                offelm.css({
                    width: width,
                    height: height,
                    display: 'block',
                    visibility:'hidden'
                });

                elm.before(offelm);

                elm.data("grid-row-offset-offelm",offelm);
            }
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
    
    
    $.fn.grid_row_offset_disable = function() {
        _fn = function(elm) {
            if (!elm.data("grid-row-offset-offelm")) return;
            
            elm.data("grid-row-offset-offelm").detach();
            
            elm.removeData("grid-row-offset-offelm");
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
}(jQuery));
(function($) {
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
    
    
    $.fn.resizable_enable = function(resize_class,click_spacing) {        
        _fn = function(elm) {
            if (elm.data("resizable-enabled")) return;
            elm.data("resizable-enabled",true);
            
            elm.data("resizable-clickspacing",click_spacing);
            elm.data("resizable-class",resize_class);
            elm.data("resizable-moveX",-1);
            elm.data("resizable-moveY",-1);
            
            elm.on("mousedown",mousedown);
            elm.on("mouseup",mouseup);
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
    
    
    $.fn.resizable_disable = function() {
        _fn = function(elm) {
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
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
}(jQuery));
(function($) {
    $.fn.smoothscrolling_enable = function(time) {        
        _fn = function(elm) {
            if (elm.data("smoothscrolling-enabled")) return;
            elm.data("smoothscrolling-enabled",true);
            
            elm.data("smoothscrolling-listener",function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                    var lehash=this.hash;
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, time,"swing",function() {
                            location.hash=lehash;
                        });
                        return false;
                    }
                    else if(this.hash=="") {
                        $('html,body').animate({
                            scrollTop: 0
                        }, time,"swing",function() {
                            location.hash=lehash;
                        });
                        return false;
                    }
                }
            });
            
            elm.on("click",elm.data("smoothscrolling-listener"));
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
    
    
    $.fn.smoothscrolling_disable = function() {
        _fn = function(elm) {
            if (!elm.data("smoothscrolling-enabled")) return;
            elm.removeData("smoothscrolling-enabled");
            
            elm.off("click",elm.data("smoothscrolling-listener"));
            
            elm.removeData("smoothscrolling-listener");
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
}(jQuery));

(function($) {
    $.fn.scrollareaoffset_enable = function(offset) {        
        _fn = function(elm) {
            elm.data("scrollareaoffset",offset);
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
    
    
    $.fn.scrollareaoffset_disable = function() {
        _fn = function(elm) {
            elm.removeData("scrollareaoffset");
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        return this;
    };
    
    $.fn.scrollareaoffset = function() {
        return $(this[0]).data("scrollareaoffset");
    }
}(jQuery));

(function($) {
    var groups=new Object();
    var groupsCurrent=new Object();
    var groupsOrder=new Object();
    
    var recalc = function() {
        $.each(groupsOrder,function(key){
            groupsOrder[key].sort(function(a,b){
                return $("#"+a).offset().top-$("#"+b).offset().top;
            });
        });
        tick();
    };
    var tick = function() {
        var scroll = $(window).scrollTop();
        $.each(groups,function(key,value){
            var newCurrent=null;
            $.each(value,function(elm) {
                var offset = ($("#"+elm).scrollareaoffset()) ? 0 : blueleaf.scrollarea.offset.top;
                if (scroll+offset >= $("#"+elm).offset().top-1) {
                    newCurrent=elm;
                }
                else {
                    return false;
                }
            });
            
            if (newCurrent != groupsCurrent[key]) {
                if (groupsCurrent[key]!=null && groupsCurrent[key]!= undefined) {
                    $.each(value[groupsCurrent[key]],function(target,clss) {
                        if (target!="_null") $(target).removeClass(clss.scrolled_class);
                    });
                }
                
                if (newCurrent!=null) {
                    $.each(value[newCurrent],function(target,clss) {
                        if (target!="_null") $(target).addClass(clss.scrolled_class);
                    });
                }
                
                groupsCurrent[key]=newCurrent;
            }
        });
    };
    
    $(window).on("touchmove", tick);
    $(window).on("scroll", tick);
    $(window).on("resize", recalc);  
    
    
    $.fn.scrollposition_enable = function(target_expr,group,scrolled_class) {
        _fn = function(elm) {
            if (elm.data("scrollposition-"+group+"-"+target)) return;
            elm.data("scrollposition-"+group+"-"+target,true);
                        
            elm.uniqueId();
            
            var target=target_expr;
            if (target=="_link") {
                target="a[href$=#"+elm.attr("name")+"]";
            }
                        
            if (groups[group]==undefined) groups[group]=new Object();
            if (groups[group][elm.attr('id')]==undefined) groups[group][elm.attr('id')]=new Object();
            groups[group][elm.attr('id')][target]={scrolled_class: scrolled_class};
            
            if (groupsOrder[group]==undefined) groupsOrder[group]=new Array();
            groupsOrder[group].push(elm.attr('id'));
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        
        recalc();
        
        return this;
    };
    
    $.fn.scrollposition_disable = function(target_expr,group) {
        _fn = function(elm) {
            if (!elm.data("scrollposition-"+group+"-"+target)) return;
            elm.removeData("scrollposition-"+group+"-"+target);
            
            var target=target_expr;
            if (target=="_link") {
                target="a[href=#"+elm.attr("name")+"]";
            }
            
            if (target!="_null") $(target).removeClass(groups[group][elm.attr('id')][target].scrolled_class);
            
            delete groups[group][elm.attr('id')][target];
            
            if (Object.keys(groups[group][elm.attr('id')]).length==0) {
                delete groups[group][elm.attr('id')];
                groupsOrder[group].splice($.inArray(elm.attr('id'), groupsOrder[group]),1);
            }
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        
        recalc();
        
        return this;
    };
})(jQuery);
(function($) {
  $.fn.sticky_enable = function(opts) {
    var parent_selector, sticky_class, z_index, stick_directions, scrollarea_offset, stick_in;
    var _fn;
    if (opts == null) {
      opts = {};
    }
    stick_in = opts.stick_in, sticky_class = opts.sticky_class, parent_selector = opts.parent, z_index = opts.z_index, stick_directions = opts.stick_directions, scrollarea_offset=opts.scrollarea_offset;

    if (parent_selector == null) {
      parent_selector = void 0;
    }
    if (sticky_class == null) {
      sticky_class = "sticked";
    }
    if (stick_directions == null) {
      stick_directions = "t";
    }
    if (scrollarea_offset == null) {
      scrollarea_offset = "";
    }
    if (z_index == null) {
        z_index=1;
    }
    if (stick_in == null) {
        stick_in="viewport";
    }
    
    _fn = function(elm) {
        var parent,spacer,container;
        var STATE={OFF: 0, VIEWPORT_TOP:1, VIEWPORT_BOTTOM: 2, PARENT_TOP: 3, PARENT_BOTTOM: 4};
        var state=STATE.OFF;
        var spacerEnabled=false;
        var element_top,element_height,parent_top,parent_height,viewport_height,viewport_top;
        var createSpacer,destroySpacer,setElementState,tick,recalc;
        var observer;
        
        // mark as enabled
        if (elm.data("sticky_enabled")) return;
        elm.data("sticky_enabled", true);
        
        // determine parent
        parent = elm.parent();
        if (parent_selector !== null) parent = parent.closest(parent_selector);
        if (!parent.length) throw "failed to find sticky_parent";
        
        // determine stick_in
        container = elm.parent();
        if (stick_in=="viewport") container = $(window);
        else if (stick_in !== null) container = container.closest(stick_in);
        if (!container.length) throw "failed to find stick_in";
        
        // check conditions
        if (elm.outerHeight(true) === parent.height()) {
            return;
        }
        
        // init spacer
        spacer = $("<div />");
        
        createSpacer = function() {
            if (spacerEnabled) return;
            spacerEnabled=true;
            
            spacer.css({
              width: elm.outerWidth(true),
              height: elm.outerHeight(true),
              display: elm.css("display"),
              "vertical-align": elm.css("vertical-align"),
              "float": elm.css("float"),
              'position': elm.css('position'),
              visibility:'hidden'
            });
            
            elm.after(spacer);
        };
        
        destroySpacer = function() {
            if (!spacerEnabled) return;
            spacerEnabled = false;
            
            spacer.detach();
        };
        
        setElementState = function(s) {
            if (s===state) return;
            var oldstate=state;
            state=s;
            
            if (s==STATE.OFF) {
                elm.css({
                    position: "",
                    top: "",
                    width: "",
                    height: "",
                    bottom: "",
                    "z-index": ""
                });
                parent.css("position", "");
                
                if (oldstate==STATE.VIEWPORT_TOP) {
                    if (scrollarea_offset.indexOf("t")!==-1) {
                        blueleaf.scrollarea.changeOffset({top:-elm.outerHeight(true)});
                    }                }
                else if (oldstate==STATE.VIEWPORT_BOTTOM) {
                    if (scrollarea_offset.indexOf("b")!==-1) {
                        blueleaf.scrollarea.changeOffset({bottom:-elm.outerHeight(true)});
                    }                
                }
                
                elm.removeClass(sticky_class);
            }
            else {
                elm.addClass(sticky_class);
                
                if (s==STATE.VIEWPORT_TOP) {
                    if (scrollarea_offset.indexOf("t")!==-1) {
                        blueleaf.scrollarea.changeOffset({top:elm.outerHeight(true)});
                    }
                    
                    elm.css ({
                        position: ((stick_in=="viewport") ? "fixed" : "absolute"),
                        "z-index": z_index,
                        top: 0,
                        bottom: "",
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }
                else if (s==STATE.VIEWPORT_BOTTOM) {
                    if (scrollarea_offset.indexOf("b")!==-1) {
                        blueleaf.scrollarea.changeOffset({bottom:elm.outerHeight(true)});
                    }
                    
                    elm.css ({
                        position: ((stick_in=="viewport") ? "fixed" : "absolute"),
                        "z-index": z_index,
                        top: "",
                        bottom: 0,
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }
                else if (s==STATE.PARENT_TOP) {
                    elm.css ({
                        position: "absolute",
                        "z-index": z_index,
                        top: parent.css("padding-top"),
                        bottom:"",
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }
                else if (s==STATE.PARENT_BOTTOM) {
                    elm.css ({
                        position: "absolute",
                        "z-index": z_index,
                        top: "",
                        bottom: parent.css("padding-bottom"),
                        width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                        height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                    });
                }
                
                if (parent.css("position") === "static") parent.css("position", "relative");
            }
        };
                        
        recalc = function() {
            if (!elm.data("sticky_enabled")) return;
            
            destroySpacer();
            setElementState(STATE.OFF);
            
            var scrolltop=container.scrollTop();
            container.scrollTop(0);
            
            viewport_top = ((stick_in=="viewport") ? 0 : container.offset().top + parseInt(container.css("border-top-width")) + parseInt(container.css("padding-top")));
            viewport_height = container.height();
            element_top = elm.offset().top - viewport_top;
            element_height = elm.outerHeight(true);
            parent_top = parent.offset().top + parseInt(parent.css("border-top-width")) + parseInt(parent.css("padding-top"));
            parent_height = parent.height();
            
            elm.addClass(sticky_class);
            element_top-=parseInt(elm.css("margin-top"));
            element_height+=parseInt(elm.css("margin-top"))+parseInt(elm.css("margin-bottom"));
            elm.removeClass(sticky_class);
            
            container.scrollTop(scrolltop);
                   
            tick();
        };
        
        tick = function() {
            if (!elm.data("sticky_enabled")) return;
            
            var scroll = container.scrollTop();
            
           
            if (scroll>element_top && stick_directions.indexOf("t")!==-1) {
                if (scroll+element_height>parent_top+parent_height) {
                    createSpacer();
                    setElementState(STATE.PARENT_BOTTOM);
                }
                else {
                    createSpacer();
                    setElementState(STATE.VIEWPORT_TOP);
                    if (stick_in!="viewport") {
                        elm.css("top",scroll);
                    }
                }
            }
            else if (scroll+viewport_height<element_top+element_height && stick_directions.indexOf("b")!==-1) {
                if (scroll+viewport_height<parent_top+element_height) {
                    createSpacer();
                    setElementState(STATE.PARENT_TOP);
                }
                else {
                    createSpacer();
                    setElementState(STATE.VIEWPORT_BOTTOM);
                    if (stick_in!="viewport") {
                        elm.css("top",viewport_height-element_height+scroll);
                    }
                }
            }
            else {
                destroySpacer();
                setElementState(STATE.OFF);
            }
        };
      
        detach = function() {
            if (!elm.data("sticky_enabled")) return;
            elm.removeData("sticky_enabled");
            
            container.off("scroll", tick);
            container.off("touchmove", tick);
            $(window).off("resize", recalc);
            elm.off("sticky_detach", detach);
            
            observer.disconnect();
            
            setElementState(STATE.OFF);
            destroySpacer();
            spacer.remove();
        };
      
        recalc();
        
        container.on("touchmove", tick);
        container.on("scroll", tick);
        $(window).on("resize", recalc);   
        elm.on("sticky_detach", detach);
    };
    for (var _i = 0, _len = this.length; _i < _len; _i++) {
        var elm = this[_i];
        _fn($(elm));
    }
    return this;
  };
  
  
  $.fn.sticky_disable = function() {
    _fn = function(elm) {
        elm.trigger("sticky_detach");
    };
    for (var _i = 0, _len = this.length; _i < _len; _i++) {
        var elm = this[_i];
        _fn($(elm));
    }
    return this;
  };

})(jQuery);
(function($) {
  $.fn.stickyfooter_enable = function(parent_selector) {
    var _fn;
    
    if (parent_selector == null) {
        parent_selector = void 0;
    }
    
    _fn = function(elm) {
        var parent;
        var STATE={OFF: 0, ON:1};
        var state=STATE.OFF;
        var setElementState,recalc;
        
        // mark as enabled
        if (elm.data("stickyfooter_enabled")) return;
        elm.data("stickyfooter_enabled", true);
        
        // determine parent
        parent = elm.parent();
        if (parent_selector !== null) parent = parent.closest(parent_selector);
        if (!parent.length) throw "failed to find sticky_parent";
                
        setElementState = function(s) {
            if (s==STATE.OFF) {
                elm.css({
                    position: "",
                    bottom: "",
                    width: "",
                    height: "",
                });
                parent.css("position", "");
            }
            else {
                setElementState(STATE.OFF);
                
                elm.css ({
                    position: "absolute",
                    bottom: 0,
                    width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                    height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                });
                
                if (parent.css("position") === "static") parent.css("position", "relative");
            }
        };
                        
        recalc = function() {
            if (!elm.data("stickyfooter_enabled")) return;
            
            parent.css("height", "auto");
            parent.css("min-height", "0");
            var contentheight=parent.height();
            parent.css("height", "");
            parent.css("min-height", "");
            
            if (contentheight<parent.height()) {
                setElementState(STATE.ON);
            }
            else {
                setElementState(STATE.OFF);
            }   
        };
              
        detach = function() {
            if (!elm.data("stickyfooter_enabled")) return;
            elm.removeData("stickyfooter_enabled");
            
            $(window).off("resize", recalc);
            elm.off("sticky_detach", detach);
            
            setElementState(STATE.OFF);
        };
      
        recalc();
        
        $(window).on("resize", recalc);   
        elm.on("stickyfooter_detach", detach);
    };
    for (var _i = 0, _len = this.length; _i < _len; _i++) {
        var elm = this[_i];
        _fn($(elm));
    }
    return this;
  };
  
  
  $.fn.stickyfooter_disable = function() {
    _fn = function(elm) {
        elm.trigger("stickyfooter_detach");
    };
    for (var _i = 0, _len = this.length; _i < _len; _i++) {
        var elm = this[_i];
        _fn($(elm));
    }
    return this;
  };

})(jQuery);
(function($) {
    var trigger=new Object();
    var actions=new Object();
    
    var triggerClass = function(target,class_name,mode) {
        if (target.hasClass(class_name) && (mode=="toggle" || mode=="off")) {
            target.removeClass(class_name);
            target.addClass(class_name+"_off");
        }
        else if (mode=="toggle" || mode=="on") {
            target.removeClass(class_name+"_off");
            target.addClass(class_name);
        }
    };
    
    var handleEvent = function(target,trigger_class,trigger_mode,priority,eventID) {
        if (actions[eventID]==undefined) actions[eventID] = new Array();
        
        var new_obj={
            target:target,
            trigger_class:trigger_class,
            trigger_mode:trigger_mode,
            priority:priority
        };        
        
        actions[eventID].push({target:"trololol"});
        
        for (var i=actions[eventID].length-1; i>=0; i--) {
            if (i!=0 && new_obj.priority<actions[eventID][i-1].priority) {
                actions[eventID][i]=actions[eventID][i-1];
            }
            else {
                actions[eventID][i]=new_obj;
                break;
            }
        }
    }
    
    $(document).on("click mouseover mouseout",function(event) {
        var eventID=event.target.id+"-"+event.type;
                
        if (actions[eventID]!=undefined) {            
            for (var i=0;i<actions[eventID].length;i++) {
                triggerClass($(actions[eventID][i].target),actions[eventID][i].trigger_class,actions[eventID][i].trigger_mode);
            }
            
            delete actions[eventID];
        }
    });
    
    $.fn.trigger_set = function(trigger_class,mode) {
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            triggerClass($(elm),trigger_class,mode);
        }
                
        return this;
    }

    $.fn.trigger_enable = function(type,target_expr,trigger_class,trigger_mode,priority) { // type: click,mouseout,mouseover; trigger_mode: on, off, toggle
        _fn = function(elm) {
            if (elm.data("trigger-"+type+"-"+target_expr+"-"+trigger_class)) return;
            elm.data("trigger-"+type+"-"+target_expr+"-"+trigger_class,true);
                        
            elm.uniqueId();
                                    
            if (trigger[elm.attr('id')]==undefined) trigger[elm.attr('id')]=new Object();
            if (trigger[elm.attr('id')][type]==undefined) trigger[elm.attr('id')][type]=new Object();
            if (trigger[elm.attr('id')][type][target_expr]==undefined) trigger[elm.attr('id')][type][target_expr]=new Object();
            trigger[elm.attr('id')][type][target_expr][trigger_class]={trigger_class: trigger_class, trigger_mode: trigger_mode, priority: priority};

            // {this}
            var target=target_expr.replace(/{this}/g, "#"+elm.attr('id'));
            
            // {parent-x}
            var parent_result;
            while((parent_result = /{parent-([0-9]+)}/g.exec(target))!=null) {
                var tmp_obj=$("#"+elm.attr('id'));
                for (var i=0; i<parent_result[1]; i++) {
                    tmp_obj=tmp_obj.parent();
                }
                tmp_obj.uniqueId();
                
                var target=target.replace(new RegExp("{parent-"+parent_result[1]+"}"), "#"+tmp_obj.attr('id'));          
            }
            
            // {attr-x}
            var attr_result;
            while((attr_result = /{attr-([0-9a-zA-Z_\-]+)}/g.exec(target))!=null) {
                var target=target.replace(new RegExp("{attr-"+attr_result[1]+"}"), elm.attr(attr_result[1]));          
            }
                                    
            elm.data("trigger-function-"+type+"-"+target_expr+"-"+trigger_class,function(event) {
                handleEvent(target,trigger_class,trigger_mode,priority,event.target.id+"-"+event.type);
                return true;
            });
            
            elm.on(type,elm.data("trigger-function-"+type+"-"+target_expr+"-"+trigger_class));
        }
    
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
                
        return this;
    };
    
    $.fn.trigger_disable = function(type,target_expr,trigger_class) {
        _fn = function(elm) {
            if (!elm.data("trigger-"+type+"-"+target_expr+"-"+trigger_class)) return;
            elm.removeData("trigger-"+type+"-"+target_expr+"-"+trigger_class);
            
            elm.off(type,elm.data("trigger-function-"+type+"-"+target_expr+"-"+trigger_class));
            elm.removeData("trigger-function-"+type+"-"+target_expr+"-"+trigger_class);
            
            delete trigger[elm.attr('id')][type][target_expr][target_expr][trigger_class];
            if (Object.keys(trigger[elm.attr('id')][type][target_expr]).length==0) {
                delete trigger[elm.attr('id')][type];
            }
            if (Object.keys(trigger[elm.attr('id')][type]).length==0) {
                delete trigger[elm.attr('id')][type];
            }
            if (Object.keys(trigger[elm.attr('id')]).length==0) {
                delete trigger[elm.attr('id')];
            }
        }
        
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            elm = this[_i];
            _fn($(elm));
        }
        
        return this;
    };
})(jQuery);
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
                    stick_in:options.stick_in,
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
    
    // Container
    $(function() {
        blueleaf.cutomrules.registerModuleQuery("container-aspectratio", {
            match: function(sel,options) {
                $(sel).container_aspectratio_enable(options.adjust,options.factor);
            },
            unmatch: function(sel,options) {
                $(sel).container_aspectratio_disable();
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
    // Warning: Uncommenting this code CAN cause endless loops and crashing browsers. Use with care. Fix is work in progress. 
    $(function() {
        var observer = new MutationObserver(function(mutations) {
            blueleaf.apply(); 
        });
        observer.observe(document, { attributes:true,childList:true,characterData:true,subtree:true });
    });*/
    
}(jQuery));