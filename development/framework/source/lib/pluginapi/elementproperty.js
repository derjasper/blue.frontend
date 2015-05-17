{
    // Element Property Change Listener
    // TODO use maps and sets
    blue.ElementProperty = {
        properties: new Map(),
        on: function (element, property, handler) {
            // element: DOM element
            // property: css.property, height, width, outerHeight, offsetTop, ...
            // handler: function(newValue,oldValue)
            var props = this.properties.get(element);

            if (props == undefined) {
                props = {};
                this.properties.set(element, props);
            }

            if (props[property] == undefined)
                props[property] = {value: this.getProperty(element, property), listener: []};

            props[property].listener.push(handler);
        },
        off: function (element, property, handler) {
            var props = this.properties.get(element);

            if (props == undefined)
                return;
            if (props[property] == undefined)
                return;
            props[property].listener = jQuery.grep(props[property].listener, function (value) {
                return value != handler;
            });

            if (props[property].listener.length == 0)
                delete props[property];
            var size = 0;
            for (var key in props) {
                if (props.hasOwnProperty(key))
                    size++;
            }
            if (size == 0)
                this.properties.delete(element);
        },
        fire: function (element, property, newVal, oldVal) {
            var props = this.properties.get(element);
            if (props == undefined)
                return;
            if (props[property] == undefined)
                return;
            for (var i = 0; i < props[property].listener.length; i++) {
                props[property].listener[i](newVal, oldVal);
            }
        },
        getProperty: function (element, property) {
            var p = property.split(".");

            if (p[0] == "css") { // p[1]: jQuery CSS
                return jQuery(element).css(p[1]);
            }
            else if (p[0] == "offset") { // p[1]: left + top
                return jQuery(element).offset()[p[1]];
            }
            else if (p[0] == "position") { // p[1]: left + top
                return jQuery(element).position()[p[1]];
            }
            else if (p[0] == "width") { // p[1]: undefined, inner, outer, outerWithMargin
                if (p[1] == undefined) {
                    return jQuery(element).width();
                }
                else if (p[1] == "inner") {
                    return jQuery(element).innerWidth();
                }
                else if (p[1] == "outer") {
                    return jQuery(element).outerWidth();
                }
                else if (p[1] == "outerWithMargin") {
                    return jQuery(element).outerWidth(true);
                }
            }
            else if (p[0] == "height") { // p[1]: undefined, inner, outer, outerWithMargin
                if (p[1] == undefined) {
                    return jQuery(element).height();
                }
                else if (p[1] == "inner") {
                    return jQuery(element).innerHeight();
                }
                else if (p[1] == "outer") {
                    return jQuery(element).outerHeight();
                }
                else if (p[1] == "outerWithMargin") {
                    return jQuery(element).outerHeight(true);
                }
            }
            else if (p[0] == "scroll") { // p[1]: top, left
                if (p[1] == "top") {
                    return jQuery(element).scrollTop();
                }
                else if (p[1] == "left") {
                    return jQuery(element).scrollLeft();
                }
            }

            return null;
        },
        check: function (element, property) { // TOOD performance / debounce events
            if (element == undefined) {
                var that = this;

                this.properties.forEach(function (val, el) {
                    that.check(el, property);
                });
            }
            else {
                var props = this.properties.get(element);

                if (property == undefined && props != undefined) {
                    var propList = [];
                    for (var prop in props)
                        propList.push(prop);
                    this.check(element, propList);
                }
                else if (props != undefined) {
                    for (var i = 0; i < property.length; i++) {
                        if (props[property[i]] != undefined) {
                            var current = this.getProperty(element, property[i]);

                            if (props[property[i]].value != current) {
                                this.fire(element, property[i], current, props[property[i]].value);
                                props[property[i]].value = current;
                            }
                        }
                    }
                }
            }
        },
        start: function () {
            (function (obj) {
                // TODO performance: debounce checks (Property Listener)

                var observer = new MutationObserver(function (mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                        var current = mutations[i].target;

                        while (current != document && current != null) {
                            obj.check(current);
                            current = current.parentNode;
                        }
                    }
                });
                observer.observe(document, {attributes: true, childList: true, characterData: true, subtree: true});

                jQuery(window).on('resize', function () {
                    obj.check();
                });
            })(this);
        }
    };
}