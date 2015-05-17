(function ($,Plugins,ElementProperty) {
    Plugins.fn.container_aspectratio = function (args) {
        var elm = this;
        
        function listener () {
            if (args.adjust == "width") {
                $(elm).width($(elm).height() * args.factor);
            }
            else {
                $(elm).height($(elm).width() * args.factor);
            }
        }
        
        return {
            enable: function () {
                listener();

                if (args.adjust == "width") {
                    ElementProperty.on(elm, "height", listener);
                }
                else {
                    ElementProperty.on(elm, "width", listener);
                }
            },
            disable: function () {
                $(elm).css({width: "", height: ""});
                
                if (args.adjust == "width") {
                    ElementProperty.off(elm, "height", listener);
                }
                else {
                    ElementProperty.off(elm, "width", listener);
                }
            }
        }
    }
    
    Plugins.fn.container_aspectratio.args = {
        adjust: "width",  // adjust: "width" or "height"
        factor: Plugins.REQUIRED // float
    };
    Plugins.fn.container_aspectratio.key = [];
}(jQuery,blue.Plugins,blue.ElementProperty));