{
    // Element Property Change Listener
    blue.ElementProperty = {
        properties: new Map(),
        on: function (element, property, handler) {
            // element: DOM element
            // property: css.property, height, width, outerHeight, offsetTop, ...
            // handler: function(newValue,oldValue)
            var props = this.properties.get(element);

            if (props == undefined) {
                props = new Map();
                this.properties.set(element, props);
            }

            if (!props.has(property))
                props.set(property, {value: this.getProperty(element, property), listener: []});

            // add handler
            props.get(property).listener.push(handler);
        },
        off: function (element, property, handler) {
            var props = this.properties.get(element);

            if (props == undefined)
                return;
            
            var le_property = props.get(property);
            
            if (le_property == undefined)
                return;
            
            // remove listener
            for (var i=0;i<le_property.listener.length;i++) {
                if (le_property.listener[i] == handler) {
                    le_property.listener.splice(i,1);
                    i--;
                }
            }

            // clean up if neccessary
            if (le_property.listener.length == 0)
                props.delete(property);
            
            if (props.size == 0)
                this.properties.delete(element);
        },
        fire: function (element, property, newVal, oldVal) {
            var props = this.properties.get(element);
            if (props == undefined)
                return;
            var le_property = props.get(property);
            if (le_property == undefined)
                return;
            for (var i = 0; i < le_property.listener.length; i++) {
                le_property.listener[i](newVal, oldVal);
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
        check: function (element, property) {
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
                    props.forEach(function (val, prop) {
                        propList.push(prop);
                    });
                    this.check(element, propList);
                }
                else if (props != undefined) {
                    for (var i = 0; i < property.length; i++) {
                        var le_property = props.get(property[i]);
                        if (le_property != undefined) {
                            var current = this.getProperty(element, property[i]);

                            if (le_property.value != current) {
                                this.fire(element, property[i], current, le_property.value);
                                le_property.value = current;
                            }
                        }
                    }
                }
            }
        },
        start: function () {
            (function (obj) {
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