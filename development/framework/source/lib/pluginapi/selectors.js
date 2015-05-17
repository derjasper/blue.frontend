{
    // Advanced Selectors
    blue.Selectors = {
        generate: function (selector, context) {
            var elm = $(context);

            // {this}
            if (/{parent-([0-9]+)}/g.exec(selector) != null) {
                elm.uniqueId();
                var selector = selector.replace(/{this}/g, "#" + elm.attr('id'));
            }

            // {parent-x}
            var parent_result;
            while ((parent_result = /{parent-([0-9]+)}/g.exec(selector)) != null) {
                var tmp_obj = elm;
                for (var i = 0; i < parent_result[1]; i++) {
                    tmp_obj = tmp_obj.parent();
                }
                tmp_obj.uniqueId();

                var selector = selector.replace(new RegExp("{parent-" + parent_result[1] + "}"), "#" + tmp_obj.attr('id'));
            }

            // {attr-x}
            var attr_result;
            while ((attr_result = /{attr-([0-9a-zA-Z_\-]+)}/g.exec(selector)) != null) {
                var selector = selector.replace(new RegExp("{attr-" + attr_result[1] + "}"), elm.attr(attr_result[1]));
            }

            return selector;
        }
    };
}