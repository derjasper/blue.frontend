var blue = {};

jQuery(function () {
    blue.ElementProperty.start();
});

// jQuery plugins
if (jQuery.fn.uniqueId == undefined) {
    jQuery.fn.uniqueId = (function () {
        var uuid = 0;

        return function () {
            return this.each(function () {
                if (!this.id) {
                    this.id = "unq-id-" + (++uuid);
                }
            });
        };
    })();
}
