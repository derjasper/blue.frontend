(function ($) {
    Plugins.fn.stickyfooter = function (scrollarea) {
        var elm = $(this.elm);

        return {
            enable: function () {
                if (elm.data("stickyfooter")!=undefined)
                    return;
                
                // determine parent
                var parent = elm.parent();
                if (scrollarea != undefined)
                    parent = parent.closest(scrollarea);
                if (!parent.length)
                    throw "Stickyfooter: failed to find parent";

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

                function detach() {
                    if (!elm.data("stickyfooter_enabled"))
                        return;
                    elm.removeData("stickyfooter_enabled");

                    $(window).off("resize", recalc);
                    elm.off("sticky_detach", detach);

                    setElementState(false);
                };

                recalc();

                $(window).on("resize", recalc);
                
                $(elm).data("stickyfooter", detach);
            },
            disable: function () {
                var detach = $(elm).data("stickyfooter");
                if (detach==undefined) return;
                
                detach();
            }
        }
    }
}(jQuery));

