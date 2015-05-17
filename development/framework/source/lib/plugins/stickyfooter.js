(function ($,Plugins) {
    Plugins.fn.stickyfooter = function (args) {
        var elm = $(this);
        
        // determine parent
        var parent = elm.parent();
        if (args.scrollarea != null)
            parent = parent.closest(args.scrollarea);
        if (!parent.length)
            throw "Stickyfooter: failed to find scroll area";

        function setElementState(s) {
            if (s == false) {
                elm.css({
                    position: "",
                    bottom: "",
                    width: "",
                    height: "",
                });
                parent.css("position", "");
            }
            else {
                setElementState(false);

                elm.css({
                    position: "absolute",
                    bottom: 0,
                    width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                    height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                });

                if (parent.css("position") === "static")
                    parent.css("position", "relative");
            }
        };

        function recalc () {
            parent.css("height", "auto");
            parent.css("min-height", "0");
            var contentheight = parent.height();
            parent.css("height", "");
            parent.css("min-height", "");

            if (contentheight < parent.height()) {
                setElementState(true);
            }
            else {
                setElementState(false);
            }
        };

        return {
            enable: function () {
                recalc();
                $(window).on("resize", recalc);
            },
            disable: function () {
                $(window).off("resize", recalc);
                setElementState(false);
            }
        }
    }
    
    Plugins.fn.stickyfooter.args = {
        scrollarea: null
    };
    Plugins.fn.stickyfooter.key = [];
}(jQuery,blue.Plugins));