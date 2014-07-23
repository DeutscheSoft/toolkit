Class = function(o) {
    var constructor;
    var methods;
    var tmp, i, c, key;

    if (typeof(o) == "function") {
        constructor = o;
        methods = {};
    } else {
        constructor = o.initialize || (function() {});
        delete o.initialize;
        methods = o;
    }

    // mixins
    if (tmp = o.Implements) {
        if (!(typeof(tmp) == "object" && tmp instanceof Array)) {
            tmp = [ tmp ];
        }

        for (i = 0; i < tmp.length; i++) {
            if (typeof(tmp[i]) == "function") {
                c = tmp[i].prototype;
            } else c = tmp[i];

            for (key in c) if (c.hasOwnProperty(key)) {
                if (typeof(c[key]) == "function") {
                    methods[key] = c[key];
                }
            }
        }
    }

    if (tmp = o.Extends) {
        if (typeof(tmp) == "function") {
            tmp = tmp.prototype;
        }
        methods.prototype = tmp;
    }

    constructor.prototype = methods;
    return constructor;
};
