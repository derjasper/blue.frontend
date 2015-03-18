(function ($) {
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
    
    Plugins.fn.resizable = function (resize_class, click_spacing) {
        var elm = $(this.elm);
        return {
            enable: function () {
                if (elm.data("resizable-enabled")) return;
                elm.data("resizable-enabled",true);

                elm.data("resizable-clickspacing",click_spacing);
                elm.data("resizable-class", resize_class);
                elm.data("resizable-moveX",-1);
                elm.data("resizable-moveY",-1);

                elm.on("mousedown",mousedown);
                elm.on("mouseup",mouseup);
            },
            disable: function () {
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
        }
    }
}(jQuery));