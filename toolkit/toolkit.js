toolkit = {
    
    // ELEMENTS
    
    get_id: function (id) {
        return document.getElementById(id);
    },
    get_class: function (cls, elm) {
        return (elm ? elm : document).getElementsByClassName(cls);
    },
    get_tag: function (tag, elm) {
        return (elm ? elm : document).getElementsByTagName(tag);
    },
    
    element : function(tag) {
        var n = document.createElement(tag);
        var i, v, j;
        for (i = 1; i < arguments.length; i++) {
            v = arguments[i]; 
            if (typeof v == "object") {
                TK.set_styles(n, v);
            } else if (typeof v == "string") {
                TK.add_class(n, v);
            } else throw("unsupported argument to TK.element");
        }
        return n;
    },
    
    destroy: function (e) {
        if (e.parentElement)
            e.parentElement.removeChild(e);
    },
    
    empty: function (e) {
        while (e.hasChildNodes()) {
            e.removeChild(e.lastChild);
        }
    },
    
    set_text : function(node, s) {
        if (node.firstChild) {
            node.firstChild.nodeValue = s;
        } else node.appendChild(document.createTextNode(s));
    },
    
    insert_after: function (newn, refn) {
        refn.parentNode.insertBefore(newn, refn.nextSibling);
    },
    insert_before: function (newn, refn) {
        refn.parentNode.insertBefore(newn, refn);
    },
    
    keep_inside: function (element, resize) {
        var ex = parseInt(TK.get_style(element, "left"));
        var ey = parseInt(TK.get_style(element, "top"));
        var ew = TK.outer_width(element, true);
        var eh = TK.outer_height(element, true);
        
        if (TK.get_style(element, "position") == "fixed") {
            var pw = TK.width();
            var ph = TK.height();
            var w  = pw;
            var h  = ph;
            var x  = Math.min(Math.max(ex, 0), w - ew);
            var y  = Math.min(Math.max(ey, 0), h - eh);
        } else {
            var p  = element.offsetParent;
            var pw = p ? p.offsetWidth : TK.width() - TK.scroll_left();
            var ph = p ? p.offsetHeight : TK.height() - TK.scroll_top();
            var x = Math.min(Math.max(ex, 0), pw - ew);
            var y = Math.min(Math.max(ey, 0), ph - eh);
        }
        if(resize) {
            if (ew > pw) element.style.width = pw + "px";
            if (eh > ph) element.style.height = ph + "px";
        }
        element.style.left = x + "px";
        element.style.top = y + "px";
    },
    
    // WINDOW
    
    width: function () {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0, document.body.clientWidth || 0);
    },
    height: function () {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0, document.body.clientHeight || 0);
    },
    
    // DIMENSIONS
    
    scroll_top: function (e) {
        if (e)
            return e.scrollTop;
        return Math.max(document.documentElement.scrollTop || 0, window.pageYOffset || 0, document.body.scrollTop || 0);
    },
    scroll_left: function (e) {
        if (e)
            return e.scrollLeft;
        return Math.max(document.documentElement.scrollLeft, window.pageXOffset || 0, document.body.scrollLeft || 0);
    },
    scroll_all_top: function (e) {
        var v = 0;
        while (e = e.parentNode) v += e.scrollTop || 0;
        return v;
    },
    scroll_all_left: function (e) {
        var v = 0;
        while (e = e.parentNode) v += e.scrollLeft || 0;
        return v;
    },
    
    position_top: function (e, rel) {
        var top    = parseInt(e.getBoundingClientRect().top);
        var fixed  = TK.fixed(e) ? 0 : TK.scroll_top();
        return top + fixed - (rel ? TK.position_top(rel) : 0);
    },
    position_left: function (e, rel) {
        var left   = parseInt(e.getBoundingClientRect().left);
        var fixed  = TK.fixed(e) ? 0 : TK.scroll_left();
        return left + fixed - (rel ? TK.position_left(rel) : 0);
    },
    
    fixed: function (e) {
        return getComputedStyle(e).getPropertyValue("position") == "fixed";
    },
    
    outer_width : function (element, margin, width) {
        var cs = getComputedStyle(element);
        var w = element.getBoundingClientRect().width;
        var m = 0;
        if (margin) {
            m += parseFloat(cs.getPropertyValue("margin-left"));
            m += parseFloat(cs.getPropertyValue("margin-right"));
        }
        if (typeof width !== "undefined") {
            if (TK.box_sizing(element) == "content-box") {
                var css = TK.css_space(element, "padding", "border");
                width -= css.left + css.right;
            }
            width -= m;
            // TODO: fixme
            if (width < 0) return 0;
            element.style.width = width + "px";
            return width;
        }
        return w + m;
    },
    
    outer_height : function (element, margin, height) {
        var cs = getComputedStyle(element, null);
        var h = element.getBoundingClientRect().height;
        var m = 0;
        if (margin) {
            m += parseFloat(cs.getPropertyValue("margin-top"));
            m += parseFloat(cs.getPropertyValue("margin-bottom"));
        }
        if (typeof height !== "undefined") {
            if (TK.box_sizing(element) == "content-box") {
                var css = TK.css_space(element, "padding", "border");
                height -= css.top + css.bottom;
            }
            height -= m;
            // TODO: fixme
            if (height < 0) return 0;
            element.style.height = height + "px";
            return height;
        }
        return h + m;
    },
    
    inner_width: function (element, width) {
        var cs = getComputedStyle(element, null);
        var w = element.getBoundingClientRect().width;
        var css = TK.css_space(element, "padding", "border");
        var x = css.left + css.right;
        if (typeof width !== "undefined") {
            if (TK.box_sizing(element) == "border-box")
                width += x;
            // TODO: fixme
            if (width < 0) return 0;
            element.style.width = width + "px";
            return width;
        }
        return w - x;
    },
    
    inner_height: function (element, height) {
        var cs = getComputedStyle(element, null);
        var h = element.getBoundingClientRect().height;
        var css = TK.css_space(element, "padding", "border");
        var y = css.top + css.bottom;
        if (typeof height !== "undefined") {
            if (TK.box_sizing(element) == "border-box")
                height += y;
            // TODO: fixme
            if (height < 0) return 0;
            element.style.height = height + "px";
            return height;
        }
        return h - y;
    },
    
    box_sizing: function (element) {
        var cs = getComputedStyle(element, null);
        if (cs.getPropertyValue("box-sizing")) return cs.getPropertyValue("box-sizing");
        if (cs.getPropertyValue("-moz-box-sizing")) return cs.getPropertyValue("-moz-box-sizing");
        if (cs.getPropertyValue("-webkit-box-sizing")) return cs.getPropertyValue("-webkit-box-sizing");
        if (cs.getPropertyValue("-ms-box-sizing")) return cs.getPropertyValue("-ms-box-sizing");
        if (cs.getPropertyValue("-khtml-box-sizing")) return cs.getPropertyValue("-khtml-box-sizing");
    },
    
    css_space: function (element) {
        var cs = getComputedStyle(element, null);
        var o = {top: 0, right: 0, bottom: 0, left: 0};
        var a;
        var s;
        for (var i = 1; i < arguments.length; i++) {
            a = arguments[i];
            for (var p in o) {
                if (o.hasOwnProperty(p)) {
                    s = a + "-" + p;
                    if (a == "border") s += "-width";
                }
                o[p] += parseFloat(cs.getPropertyValue(s));
            }
        }
        return o;
    },
    
    // CSS AND CLASSES
    
    set_styles : function(elem, styles) {
        var key, v;
        var s = elem.style;
        for (key in styles) if (styles.hasOwnProperty(key)) {
            v = styles[key];
            if (typeof v != "number" && !v) {
                delete s[key];
            } else {
                s[key] = v;
            }
        }
    },
    set_style: function (e, style, value) {
        if (typeof value == "number")
            value += "px";
        e.style[style] = value;
    },
    get_style: function (e, style) {
        if (e.currentStyle)
            return e.currentStyle[style];
        else if (window.getComputedStyle)
            return document.defaultView.getComputedStyle(e).getPropertyValue(style);
    },
    
    // STRINGS
    
    _unique_ids: [],
    unique_id: function () {
        var id;
        while (TK._unique_ids.indexOf(id = TK.random_string(8, "aA#")) > -1)
            1
        TK._unique_ids.push(id);
        return id;
    },
    
    random_string: function (length, chars) {
        // returns a random string with specified length and characters
        // a = small chars
        // A = uppercase chars
        // # = numbers
        // ! = other chars (~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\)
        if (!length) length = 16;
        if (!chars) chars = "aA#";
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
        return result;
    },
    
    FORMAT : function() {
        var cache = {};
        return function(fmt) {
            var cache_key = Array.prototype.join.call(arguments, "\0");
            if (cache.hasOwnProperty(cache_key)) return cache[cache_key];
            var args = [];
            var s = "return ";
            var res;
            var last = 0;
            var argnum = 0;
            var precision;
            var regexp = /%(\.\d+)?([bcdefgos%])/g;
            var argname;

            while (res = regexp.exec(fmt)) {
                if (argnum) s += "+";
                s += JSON.stringify(fmt.substr(last, regexp.lastIndex - res[0].length - last));
                s += "+";
                argname = "a"+argnum;
                args.push(argname);
                if (argnum+1 < arguments.length) {
                    argname = "(" + TK.sprintf(arguments[argnum+1].replace("%", "%s"), argname) + ")";
                }
                switch (res[2].charCodeAt(0)) {
                case 100: // d
                    s += "("+argname+" | 0)";
                    break;
                case 102: // f
                    if (res[1]) { // length qualifier
                        precision = parseInt(res[1].substr(1));
                        s += "(+"+argname+").toFixed("+precision+")";
                    } else {
                        s += "(+"+argname+")";
                    }
                    break;
                case 115: // s
                    s += argname;
                    break;
                case 37:
                    s += "\"%\"";
                    break;
                default:
                    throw("unknown format:"+res[0]);
                    break;
                }
                argnum++;
                last = regexp.lastIndex;
            }

            if (argnum) s += "+";
            s += JSON.stringify(fmt.substr(last));

            var fun = new Function(args, s);
            cache[cache_key] = fun;
            return fun;
    } }(),
    
    sprintf : function (fmt) {
        return TK.FORMAT(fmt).apply(this, Array.prototype.slice.call(arguments, 1));
    },
    
    
    // OS AND BROWSER CAPABILITIES
    
    is_touch: function () {
        return 'ontouchstart' in window // works on most browsers 
          || 'onmsgesturechange' in window; // works on ie10
    },
    os: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("android") > -1)
            return "Android";
        if (/iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua))
            return "iOS";
        if ((ua.match(/iPhone/i)) || (ua.match(/iPod/i)))
            return "iOS";
        if (navigator.appVersion.indexOf("Win")!=-1)
            return "Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1)
            return "MacOS";
        if (navigator.appVersion.indexOf("X11")!=-1)
            return "UNIX";
        if (navigator.appVersion.indexOf("Linux")!=-1)
            return "Linux";
    },
    
    browser: function () {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || []; 
            return { name : 'IE', version : (tem[1]||'') };
        }   
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/)
            if (tem!=null)
                return { name : 'Opera', version : tem[1] };
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
        return { name : M[0], version : M[1] };
    },
    
    // SVG
    
    make_svg: function (tag, args) {
        // creates and returns an SVG object
        // 
        // arguments:
        // tag: the element to create as string, e.g. "line" or "g"
        // args: the options to set in the element
        // 
        // returns: the newly created object
        var el = document.createElementNS('http://www.w3.org/2000/svg', "svg:" + tag);
        for (var k in args)
            el.setAttribute(k, args[k]);
        return el;
    },
    seat_all_svg: function (parent) {
        // searches all svg that don't have the class "fixed" and re-positions them
        // for avoiding blurry lines
        Array.prototype.forEach.call(TK.get_tag("svg"), function (val, index, arr) {
            if (!TK.has_class(val, "svg-fixed"))
                TK.seat_svg(val);
        });
    },
    seat_svg: function (e) {
        // move svgs if their positions in viewport is not int
        if (TK.retrieve(e, "margin-left") === null) {
            TK.store(e, "margin-left", parseFloat(TK.get_style(e, "margin-left")));
        } else {
            e.style.marginLeft = TK.retrieve(e, "margin-left");
        }
        var l = parseFloat(TK.retrieve(e, "margin-left"));
        var b = e.getBoundingClientRect();
        var x = b.left % 1;
        if (x) {
            
            if (x < 0.5) l -= x;
            else l += (1 - x);
        }
        if (e.parentElement && TK.get_style(e.parentElement, "text-align") == "center")
            l += 0.5;
        e.style.marginLeft = l + "px";
        if (TK.retrieve(e, "margin-top") === null) {
            TK.store(e, "margin-top", parseFloat(TK.get_style(e, "margin-top")));
        } else {
            e.style.marginTop = TK.retrieve(e, "margin-top");
        }
        var t = parseFloat(TK.retrieve(e, "margin-top"));
        var b = e.getBoundingClientRect();
        var y = b.top % 1;
        if (y) {
            if (x < 0.5) t -= y;
            else t += (1 - y);
        }
        e.style.marginTop = t + "px";
    },
    
    
    // EVENTS
    
    delayed_callback : function(timeout, cb, once) {
        var tid;
        var args;

        var my_cb = function() {
            tid = null;
            cb.apply(this, args);
        };
        return function() {
            args = Array.prototype.slice.call(arguments);

            if (tid)
                window.clearTimeout(tid);
            else if (once) once();
            tid = window.setTimeout(my_cb, timeout);
        };
    },
    
    _resize_events: [],
    _monitored_resize_events: -1,
    
    monitor_resize_events: function () {
        for (var i = 0; i < TK._resize_events.length; i++) {
            var r = TK._resize_events[i];
            if (r.element.offsetWidth != r.x || r.element.offsetHeight != r.y) {
                r.x = r.element.offsetWidth;
                r.y = r.element.offsetHeight;
                r.element.dispatchEvent("resize");
            }
        }
        if (TK._resize_events.length) {
            TK._monitored_resize_events = window.setTimeout("toolkit.monitor_resize_events()", 100);
        }
    },
    add_resize_event: function (element) {
        TK._resize_events.push({element: element, x: element.offsetWidth, y: element.offsetHeight});
        if (TK._monitored_resize_events < 0) {
            TK._monitored_resize_events = window.setTimeout("toolkit.monitor_resize_events()", 100);
        }
    },
    remove_resize_event: function (element) {
        for (var i = 0; i < TK._resize_events; i++) {
            if (element == TK._resize_events[i]) TK._resize_events.splice(i, 1);
            if (!TK._resize_events.length && TK._monitored_resize_events < 0) {
                window.clearTimeout(TK._monitored_resize_events);
                TK._monitored_resize_events = -1;
            }
        }
    },
    
    
    // MATH
    
    log2: function (n) {
        return Math.log(Math.max(1e-32, n)) / Math.LN2;
    },
    log10: function (n) {
        return Math.log(Math.max(1e-32, n)) / Math.LN10;
    },
    
    // ARRAYS
    
    _binary_array_search: function (arr, val, insert) {
        var high = arr.length, low = -1, mid;
        while (high - low > 1) {
            mid = (high + low) >> 1;
            if (arr[mid] < val) low = mid;
            else high = mid;
        }
        if (arr[high] == val || insert) {
            return high;
        } else {
            return -1;
        }
    },
    
    find_next: function (array, val, sort) {
        if (sort)
            var arr = array.slice(0).sort( function (a, b) { return a-b; });
        else
            var arr = array;
        // Get index
        var i = TK._binary_array_search(arr, val, true);
        // Check boundaries
        return (i >= 0 && i < arr.length) ? arr[i] : arr[arr.length - 1];
    },
    
    
    // OTHER
    
    __store_keys: [],
    __store_values: [],
    store: function (e, key, val) {
        var k = TK.__store_keys.indexOf(e);
        if (k == -1) {
            k = TK.__store_keys.push(e) - 1;
            TK.__store_values[k] = {};
        }
        TK.__store_values[k][key] = val;
    },
    retrieve: function (e, key) {
        var k = TK.__store_keys.indexOf(e);
        if (k > -1 && TK.__store_values[k].hasOwnProperty(key))
            return TK.__store_values[k][key];
    },
};
TK = toolkit;

// POLYFILLS

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};

if (typeof Object.assign === 'undefined') {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

(function() {
 if ('classList' in document.createElement("_")) {
    TK.has_class = function (e, cls) { return e.classList.contains(cls); }
    TK.add_class = function (e, cls) { e.classList.add(cls); }
    TK.remove_class = function (e, cls) { e.classList.remove(cls); }
 } else {
    // IE9
    TK.has_class = function (e, cls) {
        return e.className.split(" ").indexOf(cls) !== -1;
    };
    TK.add_class = function (e, cls) {
        var s = e.className;
        if (!s.length) {
            e.className = cls;
            return;
        }
        var a = s.split(" ");
        if (a.indexOf(cls) === -1) {
            a.push(cls);
            e.className = a.join(" ");
        }
    };
    TK.remove_class = function(e, cls) {
        var a = e.className.split(" ");
        var i = a.indexOf(cls);

        if (i !== -1) {
            do {
                a.splice(i, 1);
                i = a.indexOf(cls);
            } while (i !== -1);

            e.className = a.join(" ");
        }
    };
 }
})()

// CONSTANTS


_TOOLKIT_VARIABLE                    = -1;
_TOOLKIT_VAR                         = -1;

_TOOLKIT_NONE                        = -2;

// POSITIONS
_TOOLKIT_TOP                         = 0x00000000;
_TOOLKIT_RIGHT                       = 0x00000001;
_TOOLKIT_BOTTOM                      = 0x00000002;
_TOOLKIT_LEFT                        = 0x00000003;
_TOOLKIT_TOP_LEFT                    = 0x00000004;
_TOOLKIT_TOP_RIGHT                   = 0x00000005;
_TOOLKIT_BOTTOM_RIGHT                = 0x00000006;
_TOOLKIT_BOTTOM_LEFT                 = 0x00000007;
_TOOLKIT_CENTER                      = 0x00000008;

// DIRECTIONS
_TOOLKIT_N                           = 0x00000000;
_TOOLKIT_UP                          = 0x00000000;
_TOOLKIT_E                           = 0x00000001;
_TOOLKIT_S                           = 0x00000002;
_TOOLKIT_DOWN                        = 0x00000002;
_TOOLKIT_W                           = 0x00000003;
_TOOLKIT_NW                          = 0x00000004;
_TOOLKIT_NE                          = 0x00000005;
_TOOLKIT_SE                          = 0x00000006;
_TOOLKIT_SW                          = 0x00000007;
_TOOLKIT_C                           = 0x00000008;

_TOOLKIT_HORIZONTAL                  = 0x00010000;
_TOOLKIT_HORIZ                       = 0x00010000;
_TOOLKIT_VERTICAL                    = 0x00010001;
_TOOLKIT_VERT                        = 0x00010001;

_TOOLKIT_X                           = 0x00010000;
_TOOLKIT_Y                           = 0x00010001;

_TOOLKIT_POLAR                       = 0x00010002;

// DRAWING MODES
_TOOLKIT_CIRCULAR                    = 0x00020000;
_TOOLKIT_CIRC                        = 0x00020000;
_TOOLKIT_LINE                        = 0x00020001;
_TOOLKIT_BLOCK                       = 0x00020002;
_TOOLKIT_LINE_HORIZONTAL             = 0x00020003;
_TOOLKIT_LINE_HORIZ                  = 0x00020003;
_TOOLKIT_LINE_VERTICAL               = 0x00020004;
_TOOLKIT_LINE_VERT                   = 0x00020004;
_TOOLKIT_LINE_X                      = 0x00020003;
_TOOLKIT_LINE_Y                      = 0x00020004;
_TOOLKIT_BLOCK_LEFT                  = 0x00020005;
_TOOLKIT_BLOCK_RIGHT                 = 0x00020006;
_TOOLKIT_BLOCK_TOP                   = 0x00020007;
_TOOLKIT_BLOCK_BOTTOM                = 0x00020008;
_TOOLKIT_BLOCK_CENTER                = 0x00020009;

// SVG ELEMENT MODES
_TOOLKIT_OUTLINE                     = 0x00030000;
_TOOLKIT_FILLED                      = 0x00030001;
_TOOLKIT_FULL                        = 0x00030002;

// VALUE MODES
_TOOLKIT_PIXEL                       = 0x00040000;
_TOOLKIT_PX                          = 0x00040000;
_TOOLKIT_PERCENT                     = 0x00040001;
_TOOLKIT_PERC                        = 0x00040001;
_TOOLKIT_COEF                        = 0x00040002;
_TOOLKIT_COEFF                       = 0x00040002;
_TOOLKIT_COEFFICIENT                 = 0x00040002;

// SCALES
_TOOLKIT_FLAT                        = 0x00050000;
_TOOLKIT_LINEAR                      = 0x00050000;
_TOOLKIT_LIN                         = 0x00050000;

_TOOLKIT_DECIBEL                     = 0x00050001;
_TOOLKIT_DB                          = 0x00050001;
_TOOLKIT_LOG2_REVERSE                = 0x00050001;
_TOOLKIT_LOG2                        = 0x00050002;
_TOOLKIT_DB_REVERSE                  = 0x00050002;
_TOOLKIT_DECIBEL_REVERSE             = 0x00050002;

_TOOLKIT_FREQUENCY                   = 0x00050005;
_TOOLKIT_FREQ                        = 0x00050005;
_TOOLKIT_FREQ_REVERSE                = 0x00050006;
_TOOLKIT_FREQUENCY_REVERSE           = 0x00050006;

// FILTERS
_TOOLKIT_PARAMETRIC                  = 0x00060000;
_TOOLKIT_PARAM                       = 0x00060000;
_TOOLKIT_PEAK                        = 0x00060000;
_TOOLKIT_NOTCH                       = 0x00060001;
_TOOLKIT_LOWSHELF                    = 0x00060002;
_TOOLKIT_LOSHELF                     = 0x00060002;
_TOOLKIT_HIGHSHELF                   = 0x00060003;
_TOOLKIT_HISHELF                     = 0x00060003;
_TOOLKIT_LOWPASS_1                   = 0x00060004;
_TOOLKIT_LOWPASS_2                   = 0x00060005;
_TOOLKIT_LOWPASS_3                   = 0x00060006;
_TOOLKIT_LOWPASS_4                   = 0x00060007;
_TOOLKIT_LOPASS_1                    = 0x00060004;
_TOOLKIT_LOPASS_2                    = 0x00060005;
_TOOLKIT_LOPASS_3                    = 0x00060006;
_TOOLKIT_LOPASS_4                    = 0x00060007;
_TOOLKIT_LP1                         = 0x00060004;
_TOOLKIT_LP2                         = 0x00060005;
_TOOLKIT_LP3                         = 0x00060006;
_TOOLKIT_LP4                         = 0x00060007;
_TOOLKIT_HIGHPASS_1                  = 0x00060008;
_TOOLKIT_HIGHPASS_2                  = 0x00060009;
_TOOLKIT_HIGHPASS_3                  = 0x0006000a;
_TOOLKIT_HIGHPASS_4                  = 0x0006000b;
_TOOLKIT_HIPASS_1                    = 0x00060008;
_TOOLKIT_HIPASS_2                    = 0x00060009;
_TOOLKIT_HIPASS_3                    = 0x0006000a;
_TOOLKIT_HIPASS_4                    = 0x0006000b;
_TOOLKIT_HP1                         = 0x00060008;
_TOOLKIT_HP2                         = 0x00060009;
_TOOLKIT_HP3                         = 0x0006000a;
_TOOLKIT_HP4                         = 0x0006000b;

// CIRULAR POSITIONS
_TOOLKIT_INNER                       = 0x00080000;
_TOOLKIT_OUTER                       = 0x00080001;

// WINDOWS
_TOOLKIT_TITLE                       = 0x00090000;
_TOOLKIT_CLOSE                       = 0x00090001;
_TOOLKIT_MAX                         = 0x00090002;
_TOOLKIT_MAXIMIZE                    = 0x00090002;
_TOOLKIT_MAX_X                       = 0x00090004;
_TOOLKIT_MAX_HORIZ                   = 0x00090004;
_TOOLKIT_MAX_HORIZONTAL              = 0x00090004;
_TOOLKIT_MAXIMIZE_X                  = 0x00090004;
_TOOLKIT_MAXIMIZE_HORIZ              = 0x00090004;
_TOOLKIT_MAXIMIZE_HORIZONTAL         = 0x00090004;
_TOOLKIT_MAX_Y                       = 0x00090003;
_TOOLKIT_MAX_VERT                    = 0x00090003;
_TOOLKIT_MAX_VERTICAL                = 0x00090003;
_TOOLKIT_MAXIMIZE_Y                  = 0x00090003;
_TOOLKIT_MAXIMIZE_VERT               = 0x00090003;
_TOOLKIT_MAXIMIZE_VERTICAL           = 0x00090003;
_TOOLKIT_MINIMIZE                    = 0x00090005;
_TOOLKIT_MIN                         = 0x00090005;
_TOOLKIT_SHRINK                      = 0x00090006;
_TOOLKIT_STATUS                      = 0x000a0000;
_TOOLKIT_RESIZE                      = 0x000a0001;
_TOOLKIT_ICON                        = 0x000a0002;

// UPDATE POLICY
_TOOLKIT_CONTINUOUS                  = 0x000b0000;
_TOOLKIT_ALWAYS                      = 0x000b0000;
_TOOLKIT_CONTINUOUSLY                = 0x000b0000;
_TOOLKIT_COMPLETE                    = 0x000b0001;
_TOOLKIT_FINISHED                    = 0x000b0001;
_TOOLKIT_DONE                        = 0x000b0001;

// ELEMENTS
_TOOLKIT_ICON                        = 0x000c0000;
_TOOLKIT_LABEL                       = 0x000c0001;

// DYNAMICS
_TOOLKIT_COMPRESSOR                  = 0x000d0000;
_TOOLKIT_UPWARD_COMPRESSOR           = 0x000d0000;
_TOOLKIT_UPWARD_COMP                 = 0x000d0000;
_TOOLKIT_COMP                        = 0x000d0000;
_TOOLKIT_UPCOMP                      = 0x000d0000;
_TOOLKIT_LIMITER                     = 0x000d0001;
_TOOLKIT_GATE                        = 0x000d0002;
_TOOLKIT_NOISEGATE                   = 0x000d0002;
_TOOLKIT_EXPANDER                    = 0x000d0003;
_TOOLKIT_EXP                         = 0x000d0003;

// KEYBOARDS
_TOOLKIT_KEYBOARD_MAIN               = 0x000e0000;
_TOOLKIT_KEYBOARD_NUMPAD             = 0x000e0001;
_TOOLKIT_KEYBOARD_MIDI               = 0x000e0002;


// LANGUAGES
_TOOLKIT_LANGUAGE_ENGLISH            = 0x000f0000;
_TOOLKIT_LANGUAGE_GERMAN             = 0x000f0001;

// KEYBOARD TEXT BUFFER TYPES
_TOOLKIT_TEXT_INPUT                  = 0x00100000;
_TOOLKIT_TEXT_AREA                   = 0x00100001;
