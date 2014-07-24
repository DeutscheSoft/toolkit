(function() {
var merge = function(dst, src) {
    console.log("merging", src, "into", dst);
    var key;
    for (key in src) {
        dst[key] = src[key];
    }
    return dst;
};
var mixin = function(dst, src, warn) {
    var fun, key;
    for (key in src) {
        if (key === "constructor" ||
            key === "_class" ||
            key === "Extends" ||
            key === "Implements" ||
            key === "options") continue;
        if (!src.hasOwnProperty(key)) continue;

        fun = src[key];

        if (warn && typeof(fun) == "object") {
            console.log("static variable", key, ":", fun);
        }
        if (warn && dst.hasOwnProperty(key)) {
            console.log("overwriting", key, "in", dst, "with", fun);
        }
        dst[key] = fun;
    }

    return dst;
};
$mixin = mixin;
$class = function(o) {
    var constructor;
    var methods;
    var tmp, i, c, key;

    constructor = o.initialize || (function() {});

    if (tmp = o.Extends) {
        if (typeof(tmp) == "function") {
            tmp = tmp.prototype;
        }
        if (typeof(o.options) == "object" &&
            typeof(tmp.options) == "object") {
            o.options = Object.setPrototypeOf(o.options, tmp.options);
        }
        methods = Object.setPrototypeOf(o, tmp);
    } else {
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

            if (typeof(c.options) == "object") {
                if (!methods.hasOwnProperty("options")) {
                    methods.options = Object.create(method.options);
                }
                merge(methods.options, c.options);
            }

            methods = mixin(methods, c, true);
        }
    }

    constructor.prototype = methods;
    methods.constructor = constructor;
    return constructor;
};
})();
