// TODO sticky anpassen
// TODO komplett überarbeiten
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