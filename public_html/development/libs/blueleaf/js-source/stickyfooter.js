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