toolkit = {
    set_styles : function(elem, styles) {
        var key;
        for (key in styles) if (styles.hasOwnProperty(key))
            elem.style[key] = styles[key];
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
    set_text : function(node, s) {
        if (node.firstChild) {
            node.firstChild.nodeValue = s;
        } else node.appendChild(document.createTextNode(s));
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
            if (cs.getPropertyValue("box-sizing") == "content-box") {
                var css = toolkit.css_space(element, "padding", "border");
                width -= css.left + css.right;
            }
            width -= m;
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
            
            if (cs.getPropertyValue("box-sizing") == "content-box") {
                var css = toolkit.css_space(element, "padding", "border");
                height -= css.top + css.bottom;
            }
            height -= m;
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
            if (cs.getPropertyValue("box-sizing") == "border-box")
                width += x;
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
            if (cs.getPropertyValue("box-sizing") == "border-box")
                height += y;
            element.style.height = height + "px";
            return height;
        }
        return h - y;
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
    }
};
