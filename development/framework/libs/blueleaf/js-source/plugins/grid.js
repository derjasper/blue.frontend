(function ($) {
    Plugins.fn.grid_offset = function (args) {
        var elm = this;
        
        var offelm = $("<div />");
        
        offelm.css({
            width: args.width,
            height: args.height,
            display: 'block',
            visibility: 'hidden'
        });
        
        return {
            enable: function () {
                $(elm).before(offelm);
            },
            disable: function () {
                offelm.detach();
            }
        }
    }
    
    Plugins.fn.grid_offset.args = {
        width:Plugins.REQUIRED,
        height:Plugins.REQUIRED
    };
    Plugins.fn.grid_offset.key = [];
}(jQuery));
