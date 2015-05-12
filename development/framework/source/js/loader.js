(function () {
    // get JSON data from CSS, and enable media querys
    jQuery(function () {
        function getStyleSheets() {
            var links = document.getElementsByTagName('link');
            var stylesheets = [];

            for (var i = 0; i < links.length; i++) {
                if (links[i].rel.match(/stylesheet/)) {
                    stylesheets.push(links[i].href);
                }
            }

            return stylesheets;
        }

        var stylesheets = getStyleSheets();
        var loaded = 0;
        function init() {
            loaded++;
            if (loaded == stylesheets.length)
                blueleaf.customrules.init();
        }
        for (var i = 0; i < stylesheets.length; i++) {
            jQuery.get(stylesheets[i], null, function (data) {
                if (data.indexOf("/*! blueleaf */") === 0) {
                    var tree = parseCSS(data);
                    if (tree != null) {
                        blueleaf.customrules.addProperties(tree);
                    }
                }

                init();
            });
        }
    });
}());