(function($) {
    $.fn.smoothscrolling_enable = function(time) {        
        _fn = function(elm) {
            if (elm.data("smoothscrolling-enabled")) return;
            elm.data("smoothscrolling-enabled",true);
            
            elm.data("smoothscrolling-listener",function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, time);
                        return false;
                    }
                    else if(this.hash=="") {
                        $('html,body').animate({
                            scrollTop: 0
                        }, time);
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
