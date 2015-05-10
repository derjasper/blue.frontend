// TODO durch dritte libs ersetzen
// TODO was ist mit modernizr?

// Map
if (Map == undefined) {
    console.log("enabling map polyfill");
    var LegacyMap = function () {
        this._dict = {};
        this._keys = {};
    }
    LegacyMap.prototype._shared = {id: 1};
    LegacyMap.prototype.set = function (key, value) {
        if (key.nodeType) {
            var hashid = jQuery.data(key, "_hashid");
            if (hashid == undefined) {
                hashid = this._shared.id++;
                jQuery.data(key, "_hashid", hashid);
            }
            this._dict[hashid] = value;
            this._keys[hashid] = key;
        }
        else if (typeof key == "object") {
            if (key._hashid == undefined) {
                key._hashid = this._shared.id++;
            }
            this._dict[key._hashid] = value;
            this._keys[key._hashid] = key;
        }
        else {
            this._dict[key] = value;
        }
        return this;
    }
    LegacyMap.prototype.get = function (key) {
        if (key instanceof Element) {
            var hashid = jQuery.data(key, "_hashid");
            return hashid == undefined ? undefined : this._dict[hashid];
        }
        else if (typeof key == "object") {
            return key._hashid == undefined ? undefined : this._dict[key._hashid];
        }
        else {
            return this._dict[key];
        }
    }
    LegacyMap.prototype.delete = function (key) {
        if (key instanceof Element) {
            var hashid = jQuery.data(key, "_hashid");
            delete this._dict[hashid];
            delete this._keys[hashid];
        }
        else if (typeof key == "object") {
            delete this._dict[key._hashid];
            delete this._keys[key._hashid];
        }
        else {
            delete this._dict[key];
        }
    }
    LegacyMap.prototype.forEach = function (callback) {
        var keys = this._keys;
        var dict = this._dict;
        for (var hashid in keys) {
            callback(dict[hashid], keys[hashid]);
        }
    }

    var Map = LegacyMap;
}

// Element.matches
ElementPrototype = (window.Element || window.Node || window.HTMLElement).prototype;
if (ElementPrototype.matches == undefined) {
    console.log("enabling Element.matches polyfill");
    
    ElementPrototype.matches = function (selector) {
        var dom_element = this;
        var matchesSelector = dom_element.matches || dom_element.matchesSelector || dom_element.webkitMatchesSelector || dom_element.mozMatchesSelector || dom_element.msMatchesSelector || dom_element.oMatchesSelector;
        if (matchesSelector)
            return matchesSelector.call(dom_element, selector);

        var matches = (dom_element.document || dom_element.ownerDocument).querySelectorAll(selector);
        var i = 0;

        while (matches[i] && matches[i] !== dom_element) {
            i++;
        }

        return matches[i] ? true : false;
    }
}

// Set
// TODO set polyfill