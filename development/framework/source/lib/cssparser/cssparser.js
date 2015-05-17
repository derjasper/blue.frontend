var CSSParser;

{
    CSSParser = {};

    CSSParser.parse = function parse(css) {
        var tree = new Object();

        var currentId = "";
        var openBrackets = [];
        var comment = false;

        var pos = 0;
        while (pos < css.length) {
            if (!comment && css[pos] == "/") {
                var match = /^\/\*! customrule: ({(?:(?!\*\/).)*}) \*\//g.exec(css.substring(pos));

                if (match != null) {
                    pos += match.index + match[0].length;

                    var mediaQuery = '';
                    var selector = '';

                    for (var i = 0; i < openBrackets.length; i++) {
                        if (openBrackets[i].indexOf("@media") === 0) {
                            var str = openBrackets[i].substring(6).trim();

                            if (mediaQuery == "")
                                mediaQuery = str;
                        }
                        else if (openBrackets[i].indexOf("@") === -1) {
                            selector = openBrackets[i];
                        }
                    }

                    if (mediaQuery == "") {
                        mediaQuery = "all";
                    }

                    if (selector == "")
                        return null;

                    var json;
                    try {
                        json = JSON.parse(match[1])
                    }
                    catch (e) {
                        return null;
                    }

                    if (tree[mediaQuery] == undefined)
                        tree[mediaQuery] = {};
                    if (tree[mediaQuery][selector] == undefined)
                        tree[mediaQuery][selector] = [];

                    tree[mediaQuery][selector].push(json);

                    continue;
                }
            }

            if (!comment) {
                if (css[pos] == "{") {
                    openBrackets.push(currentId.trim());
                    currentId = "";
                }
                else if (css[pos] == "}") {
                    openBrackets.pop();
                    currentId = "";
                }
                else if (css[pos] == ";") {
                    currentId = "";
                }
                else if (css[pos] == "/" && pos + 1 < css.length && css[pos + 1] == "*") {
                    comment = true;
                    currentId = "";
                }
                else {
                    currentId += css[pos];
                }
            }
            else {
                if (css[pos] == "*" && pos + 1 < css.length && css[pos + 1] == "/") {
                    comment = false;
                }
            }

            pos++;
        }

        if (openBrackets.length != 0)
            return null;

        return tree;
    };
}