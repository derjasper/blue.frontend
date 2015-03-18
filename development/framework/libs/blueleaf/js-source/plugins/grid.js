(function ($) {
    Plugins.fn.grid_offset = function (width, height) {
        var elm = this.elm;
        return {
            enable: function () {
                if ($(elm).data("grid-row-offset-offelm")) {
                    $(elm).data("grid-row-offset-offelm").css({
                        width: width,
                        height: height,
                        display: 'block',
                        visibility: 'hidden'
                    });
                }
                else {
                    var offelm = $("<div />");

                    offelm.css({
                        width: width,
                        height: height,
                        display: 'block',
                        visibility: 'hidden'
                    });

                    $(elm).before(offelm);

                    $(elm).data("grid-row-offset-offelm", offelm);
                }
            },
            disable: function () {
                if (!elm.data("grid-row-offset-offelm"))
                    return;

                $(elm).data("grid-row-offset-offelm").detach();

                $(elm).removeData("grid-row-offset-offelm");
            }
        }
    }
}(jQuery));