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
                toolkit.set_styles(n, v);
            } else if (typeof v == "string") {
                n.classList.add(v);
            } else throw("unsupported argument to toolkit.element");
        }
        return n;
    },
    
    destroy: function (e) {
        e.parentElement.remove(e);
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
    
    keep_inside: function (element, resize) {
        var ex = parseInt(element.getStyle("left"));
        var ey = parseInt(element.getStyle("top"));
        var ew = toolkit.outer_width(element, true);
        var eh = toolkit.outer_height(element, true);
        
        if (element.getStyle("position") == "fixed") {
            var pw = width();
            var ph = height();
            var w  = pw;
            var h  = ph;
            var x  = Math.min(Math.max(ex, 0), w - ew);
            var y  = Math.min(Math.max(ey, 0), h - eh);
        } else {
            var p  = element.offsetParent;
            var pw = p ? p.offsetWidth : width() - TK.scroll_left();
            var ph = p ? p.offsetHeight : height() - TK.scroll_top();
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
            return e.scrollTop();
        return Math.max(document.documentElement.scrollTop || 0, window.pageYOffset || 0, document.body.scrollTop || 0);
    },
    scroll_left: function (e) {
        if (e)
            return e.scrollLeft();
        return Math.max(document.documentElement.scrollLeft, window.pageXOffset || 0, document.body.scrollLeft || 0);
    },
    
    outer_width : function (element, margin, width) {
        var cs = getComputedStyle(element, null);
        var w = element.getBoundingClientRect().width;
        var m = 0;
        if (margin) {
            m += parseFloat(cs.getPropertyValue("margin-left"));
            m += parseFloat(cs.getPropertyValue("margin-right"));
        }
        if (typeof width !== "undefined") {
            if (toolkit.box_sizing(element) == "content-box") {
                var css = toolkit.css_space(element, "padding", "border");
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
            if (toolkit.box_sizing(element) == "content-box") {
                var css = toolkit.css_space(element, "padding", "border");
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
        var css = toolkit.css_space(element, "padding", "border");
        var x = css.left + css.right;
        if (typeof width !== "undefined") {
            if (toolkit.box_sizing(element) == "border-box")
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
        var css = toolkit.css_space(element, "padding", "border");
        var y = css.top + css.bottom;
        if (typeof height !== "undefined") {
            if (toolkit.box_sizing(element) == "border-box")
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
    
    has_class: function (e, cls) {
        return e.getAttribute("class").match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
     
    add_class: function (e, cls) {
        if (!TK.has_class(e, cls)) e.setAttribute("class",
            e.getAttribute("class") + " " + cls);
    },
     
    remove_class: function (e, cls) {
        if (TK.has_class(e, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            e.setAttribute("class", e.getAttribute("class").replace(reg, ' '));
        }
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
                    argname = "(" + toolkit.sprintf(arguments[argnum+1].replace("%", "%s"), argname) + ")";
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
        return toolkit.FORMAT(fmt).apply(this, Array.prototype.slice.call(arguments, 1));
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
            if (!val.classList.contains("svg-fixed"))
                TK.seat_svg(val);
        });
    },
    seat_svg: function (e) {
        // move svgs if their positions in viewport is not int
        if (e.retrieve("margin-left") === null) {
            e.store("margin-left", e.getStyle("margin-left").toFloat());
        } else {
            e.style.marginLeft = e.retrieve("margin-left");
        }
        var l = e.retrieve("margin-left").toFloat();
        var b = e.getBoundingClientRect();
        var x = b.left % 1;
        if (x) {
            
            if (x < 0.5) l -= x;
            else l += (1 - x);
        }
        if (e.getParent() && e.getParent().getStyle("text-align") == "center")
            l += 0.5;
        e.style.marginLeft = l + "px";
        if (e.retrieve("margin-top") === null) {
            e.store("margin-top", e.getStyle("margin-top").toFloat());
        } else {
            e.style.marginTop = e.retrieve("margin-top");
        }
        var t = e.retrieve("margin-top").toFloat();
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
        for (var i = 0; i < toolkit._resize_events.length; i++) {
            var r = toolkit._resize_events[i];
            if (r.element.offsetWidth != r.x || r.element.offsetHeight != r.y) {
                r.x = r.element.offsetWidth;
                r.y = r.element.offsetHeight;
                r.element.dispatchEvent("resize");
            }
        }
        if (toolkit._resize_events.length) {
            toolkit._monitored_resize_events = window.setTimeout("toolkit.monitor_resize_events()", 100);
        }
    },
    add_resize_event: function (element) {
        toolkit._resize_events.push({element: element, x: element.offsetWidth, y: element.offsetHeight});
        if (toolkit._monitored_resize_events < 0) {
            toolkit._monitored_resize_events = window.setTimeout("toolkit.monitor_resize_events()", 100);
        }
    },
    remove_resize_event: function (element) {
        for (var i = 0; i < toolkit._resize_events; i++) {
            if (element == toolkit._resize_events[i]) toolkit._resize_events.splice(i, 1);
            if (!toolkit._resize_events.length && toolkit._monitored_resize_events < 0) {
                window.clearTimeout(toolkit._monitored_resize_events);
                toolkit._monitored_resize_events = -1;
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

};
TK = toolkit;

// POLYFILLS

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};
