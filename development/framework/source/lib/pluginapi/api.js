"use strict";

var blue = {};

jQuery(function () {
    blue.ElementProperty.start();
});

// jQuery plugins // TODO replace (create a Plugin API?) or move into another lib
{
    var uuid = 0;
    jQuery.fn.uniqueId = function () {
        return this.each(function () {
            if (!this.id) {
                this.id = "uuid-" + (++uuid);
            }
        });
    };
}