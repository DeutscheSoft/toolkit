(function() {
var mixin = function(dst, src, warn) {
    var fun;
    for (key in src) if (key != "constructor" && src.hasOwnProperty(key)) {
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

$options = {
    setOptions : function() {
        var ret = this.options ? mixin({}, this.options) : {};

        for (i = 0; i < arguments.length; i++) {
            ret = mixin(ret, arguments[i]);
        }

        return this.options = ret;
    },
};
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

            methods = mixin(methods, c, true);
        }
    }

    constructor.prototype = methods;
    methods.constructor = constructor;
    return constructor;
};
})();
