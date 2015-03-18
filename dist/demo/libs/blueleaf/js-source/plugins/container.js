(function ($) {
    Plugins.fn.container_aspectratio = function (adjust, factor) { // adjust: "width" or "height"; factor: float
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("container-aspectratio"))
                    return;

                $(elm).data("container-aspectratio", {
                    listener: function () {
                        if (adjust == "width") {
                            $(elm).width($(elm).height() * factor);
                        }
                        else {
                            $(elm).height($(elm).width() * factor);
                        }
                    }
                }
                );
                $(elm).data("container-aspectratio").listener();

                if (adjust == "width") {
                    ElementProperty.on(elm, "height", $(elm).data("container-aspectratio").listener);
                }
                else {
                    ElementProperty.on(elm, "width", $(elm).data("container-aspectratio").listener);
                }
            },
            disable: function () {
                if (!$(elm).data("container-aspectratio"))
                    return;

                $(elm).css({width: "", height: ""});

                if (adjust == "width") {
                    ElementProperty.off(elm, "height", $(elm).data("container-aspectratio").listener);
                }
                else {
                    ElementProperty.off(elm, "width", $(elm).data("container-aspectratio").listener);
                }

                $(elm).removeData("container-aspectratio");
            }
        }
    }
}(jQuery));