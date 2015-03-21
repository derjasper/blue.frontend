(function ($) {
    Plugins.fn.sticky = function (directions, scrollarea_sel, container_sel, sticky_class) {
        var rawElm = this.elm;
        var elm = $(rawElm);
        return {
            enable: function () {
                if ($.data(rawElm,"sticky")!=undefined) return;
                
                // default values
                directions = directions || {top:true,bottom:false};
                scrollarea_sel = scrollarea_sel || "viewport";
                container_sel = container_sel || null; if (container_sel=="_null") container_sel = null;
                sticky_class = sticky_class || "sticky";
                // offset is determined through the element's margin with sticky_class applied.
                // z_index should be handled with CSS/SASS
                
                // init vars
                var container, spacer, scrollarea;
                var STATE = {OFF: 0, VIEWPORT_TOP: 1, VIEWPORT_BOTTOM: 2, PARENT_TOP: 3, PARENT_BOTTOM: 4};
                var state = STATE.OFF;
                var spacerEnabled = false;
                var element_top, element_height, parent_top, parent_height, viewport_height, viewport_top;

                // determine scrollarea
                scrollarea = elm.parent();
                if (scrollarea_sel == "viewport")
                    scrollarea = $(window);
                else if (scrollarea_sel !== null)
                    scrollarea = scrollarea.closest(scrollarea_sel);
                if (!scrollarea.length)
                    throw "failed to find scrollarea";
                
                // determine container
                if (container_sel==null)
                    container=null;
                else {
                    container = elm.parent();
                    container = container.closest(container_sel);
                    if (!container.length)
                        throw "failed to find container";
                }
                

                // init spacer
                spacer = $("<div />");

                function createSpacer () {
                    if (spacerEnabled)
                        return;
                    spacerEnabled = true;

                    spacer.css({
                        width: elm.outerWidth(true),
                        height: elm.outerHeight(true),
                        display: elm.css("display"),
                        "vertical-align": elm.css("vertical-align"),
                        "float": elm.css("float"),
                        'position': elm.css('position'),
                        visibility: 'hidden'
                    });

                    elm.after(spacer);
                };

                function destroySpacer() {
                    if (!spacerEnabled)
                        return;
                    spacerEnabled = false;

                    spacer.detach();
                };

                function setElementState (s) {
                    if (s === state)
                        return;
                    state = s;

                    if (s == STATE.OFF) {
                        elm.css({
                            position: "",
                            top: "",
                            width: "",
                            height: "",
                            bottom: ""
                        });
                        if (container!=null) container.css("position", "");

                        elm.removeClass(sticky_class);
                    }
                    else {
                        elm.addClass(sticky_class);

                        if (s == STATE.VIEWPORT_TOP) {
                            elm.css({
                                position: ((scrollarea_sel == "viewport") ? "fixed" : "absolute"),
                                top: 0,
                                bottom: "",
                                width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                                height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                            });
                        }
                        else if (s == STATE.VIEWPORT_BOTTOM) {
                            elm.css({
                                position: ((scrollarea_sel == "viewport") ? "fixed" : "absolute"),
                                top: "",
                                bottom: 0,
                                width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                                height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                            });
                        }
                        else if (s == STATE.PARENT_TOP && container!=null) {
                            elm.css({
                                position: "absolute",
                                top: container.css("padding-top"),
                                bottom: "",
                                width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                                height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                            });
                        }
                        else if (s == STATE.PARENT_BOTTOM && container!=null) {
                            elm.css({
                                position: "absolute",
                                top: "",
                                bottom: container.css("padding-bottom"),
                                width: elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px",
                                height: elm.css("box-sizing") === "border-box" ? elm.outerHeight() + "px" : elm.height() + "px"
                            });
                        }

                        if (container!=null && container.css("position") === "static")
                            container.css("position", "relative");
                    }
                };

                function recalc() {
                    destroySpacer();
                    setElementState(STATE.OFF);

                    var scrolltop = scrollarea.scrollTop();
                    scrollarea.scrollTop(0);

                    viewport_top = ((scrollarea_sel == "viewport") ? 0 : scrollarea.offset().top + parseInt(scrollarea.css("border-top-width")) + parseInt(scrollarea.css("padding-top")));
                    viewport_height = scrollarea.height();
                    element_top = elm.offset().top - viewport_top;
                    element_height = elm.outerHeight(true);
                    
                    if (container!=null) {
                        parent_top = container.offset().top + parseInt(container.css("border-top-width")) + parseInt(container.css("padding-top"));
                        parent_height = container.height();
                    }
                    else {
                        parent_top=null;
                        parent_height=null;
                    }
                    
                    elm.addClass(sticky_class);
                    element_top -= parseInt(elm.css("margin-top"));
                    element_height += parseInt(elm.css("margin-top")) + parseInt(elm.css("margin-bottom"));
                    elm.removeClass(sticky_class);

                    scrollarea.scrollTop(scrolltop);

                    tick();
                };

                function tick () {
                    var scroll = scrollarea.scrollTop();
                    
                    if (scroll > element_top && directions.top) {
                        if (container!=null && scroll + element_height > parent_top + parent_height) {
                            createSpacer();
                            setElementState(STATE.PARENT_BOTTOM);
                        }
                        else {
                            createSpacer();
                            setElementState(STATE.VIEWPORT_TOP);
                            if (scrollarea_sel != "viewport") {
                                elm.css("top", scroll);
                            }
                        }
                    }
                    else if (scroll + viewport_height < element_top + element_height && directions.bottom) {
                        if (container!=null && scroll + viewport_height < parent_top + element_height) {
                            createSpacer();
                            setElementState(STATE.PARENT_TOP);
                        }
                        else {
                            createSpacer();
                            setElementState(STATE.VIEWPORT_BOTTOM);
                            if (scrollarea_sel != "viewport") {
                                elm.css("top", viewport_height - element_height + scroll);
                            }
                        }
                    }
                    else {
                        destroySpacer();
                        setElementState(STATE.OFF);
                    }
                };

                function detach () {
                    scrollarea.off("scroll", tick);
                    scrollarea.off("touchmove", tick);
                    $(window).off("resize", recalc);

                    setElementState(STATE.OFF);
                    destroySpacer();
                    spacer.remove();
                };

                recalc();

                scrollarea.on("touchmove", tick);
                scrollarea.on("scroll", tick);
                $(window).on("resize", recalc);
                // TODO listen to DOM mutations / use Element Property Listener; save less variables in recalc
                
                $.data(rawElm,"sticky",detach);

            },
            disable: function () {
                var detach = $.data(rawElm,"sticky");
                if (detach==undefined) return;
                $.removeData(rawElm,"sticky");
                detach();
            }
        }
    }
}(jQuery));