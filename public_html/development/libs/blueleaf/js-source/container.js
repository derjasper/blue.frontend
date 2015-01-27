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