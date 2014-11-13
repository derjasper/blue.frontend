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